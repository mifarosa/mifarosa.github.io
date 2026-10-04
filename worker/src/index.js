// Admin backend for mifarosa.com, deployed as a Cloudflare Worker.
//
//   GET /auth, /callback  GitHub sign-in for Sveltia CMS and /admin. Speaks the same popup
//                         protocol as Sveltia CMS Authenticator (github.com/sveltia/sveltia-cms-auth)
//                         and only lets ALLOWED_USER in.
//   GET /stats/<name>     GoatCounter stats for /admin. The caller sends its GitHub token; the
//                         GoatCounter API key never leaves this worker.
//
// Vars (wrangler.toml): ALLOWED_USER, ALLOWED_DOMAINS, ALLOWED_ORIGINS, GOATCOUNTER_CODE
// Secrets: GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, GOATCOUNTER_KEY

const SCOPES = ['repo', 'public_repo', 'read:user'];
const DEFAULT_SCOPE = 'public_repo';
const STATS = ['total', 'hits', 'toprefs', 'browsers', 'systems', 'locations', 'languages', 'sizes', 'campaigns'];
const USER_AGENT = 'mifarosa-admin';

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    try {
      if (pathname === '/auth') return handleAuth(request, env);
      if (pathname === '/callback') return await handleCallback(request, env);
      if (pathname.startsWith('/stats/')) return await handleStats(request, env);
      return new Response('Not found', { status: 404 });
    } catch (err) {
      console.error(err);
      return new Response('Internal error', { status: 500 });
    }
  },
};

// ---------- Sign-in ----------

const list = (value) => (value ?? '').split(',').map((s) => s.trim()).filter(Boolean);

// "mifarosa.com" matches the domain itself; "*.example.com" matches its subdomains
const domainAllowed = (env, hostname) =>
  list(env.ALLOWED_DOMAINS).some((d) =>
    d.startsWith('*.') ? hostname.endsWith(d.slice(1)) : hostname === d);

// Popup page that hands the result to the window that opened it, but only a trusted one
function popupResult(env, { token, error }) {
  const state = error ? 'error' : 'success';
  const content = error ? { provider: 'github', error } : { provider: 'github', token };
  const message = `authorization:github:${state}:${JSON.stringify(content)}`;
  const allowed = JSON.stringify(list(env.ALLOWED_DOMAINS));
  const html = `<!doctype html><html><body><script>
    (() => {
      const allowed = ${allowed.replaceAll('<', '\\u003c')};
      const trusted = (origin) => {
        try {
          const host = new URL(origin).hostname;
          return allowed.some((d) => d.startsWith('*.') ? host.endsWith(d.slice(1)) : host === d);
        } catch (e) { return false; }
      };
      window.addEventListener('message', ({ data, origin }) => {
        if (data !== 'authorizing:github') return;
        // An error carries no secret, so it may go to any opener
        if (${JSON.stringify(!error)} && !trusted(origin)) return;
        window.opener?.postMessage(${JSON.stringify(message).replaceAll('<', '\\u003c')}, origin);
      });
      window.opener?.postMessage('authorizing:github', '*');
    })();
  </script></body></html>`;
  return new Response(html, {
    headers: {
      'Content-Type': 'text/html;charset=UTF-8',
      'Set-Cookie': 'csrf-token=deleted; HttpOnly; Max-Age=0; Path=/; SameSite=Lax; Secure',
    },
  });
}

function handleAuth(request, env) {
  const params = new URL(request.url).searchParams;
  if ((params.get('provider') ?? 'github') !== 'github') return popupResult(env, { error: 'Yalnız GitHub ile giriş destekleniyor.' });
  if (!domainAllowed(env, params.get('site_id') ?? '')) return popupResult(env, { error: 'Bu site bu girişi kullanamaz.' });
  if (!env.GITHUB_CLIENT_ID || !env.GITHUB_CLIENT_SECRET) return popupResult(env, { error: 'GitHub OAuth uygulaması ayarlanmamış (GITHUB_CLIENT_ID / GITHUB_CLIENT_SECRET).' });

  const requested = (params.get('scope') ?? '').split(/[\s,]+/).filter(Boolean);
  const scope = requested.length && requested.every((s) => SCOPES.includes(s)) ? requested.join(',') : DEFAULT_SCOPE;
  const csrf = crypto.randomUUID().replaceAll('-', '');
  const authorize = new URL('https://github.com/login/oauth/authorize');
  authorize.search = new URLSearchParams({ client_id: env.GITHUB_CLIENT_ID, scope, state: csrf }).toString();

  return new Response(null, {
    status: 302,
    headers: {
      Location: authorize.toString(),
      'Set-Cookie': `csrf-token=${csrf}; HttpOnly; Path=/; Max-Age=600; SameSite=Lax; Secure`,
    },
  });
}

async function handleCallback(request, env) {
  const params = new URL(request.url).searchParams;
  const csrf = request.headers.get('Cookie')?.match(/\bcsrf-token=([0-9a-f]{32})\b/)?.[1];
  if (!params.get('code') || !csrf || params.get('state') !== csrf) {
    return popupResult(env, { error: 'Giriş doğrulanamadı, tekrar dene.' });
  }

  const res = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json', 'User-Agent': USER_AGENT },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code: params.get('code'),
    }),
  });
  const { access_token: token, error_description: problem } = await res.json().catch(() => ({}));
  if (!token) return popupResult(env, { error: problem || 'GitHub giriş anahtarı vermedi.' });

  // Only the site owner gets a token back, even though GitHub would sign anyone in
  if (!(await isAllowedUser(env, token))) {
    return popupResult(env, { error: `Buraya sadece @${env.ALLOWED_USER} girebilir.` });
  }
  return popupResult(env, { token });
}

// ---------- Identity check ----------

// Per-isolate memo of tokens already checked, so a dashboard load costs one GitHub call
const checked = new Map();
const CHECK_TTL = 10 * 60 * 1000;

async function isAllowedUser(env, token) {
  const key = await sha256(token);
  const hit = checked.get(key);
  if (hit && hit.until > Date.now()) return hit.ok;

  const res = await fetch('https://api.github.com/user', {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'User-Agent': USER_AGENT },
  });
  const user = res.ok ? await res.json() : null;
  const ok = !!user && user.login.toLowerCase() === String(env.ALLOWED_USER).toLowerCase();
  if (checked.size > 100) checked.clear();
  checked.set(key, { ok, until: Date.now() + CHECK_TTL });
  return ok;
}

async function sha256(text) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

// ---------- Stats proxy ----------

function cors(env, request) {
  const origin = request.headers.get('Origin');
  const headers = { Vary: 'Origin' };
  if (origin && list(env.ALLOWED_ORIGINS).includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers['Access-Control-Allow-Headers'] = 'Authorization';
    headers['Access-Control-Allow-Methods'] = 'GET, OPTIONS';
    headers['Access-Control-Max-Age'] = '86400';
  }
  return headers;
}

const json = (body, status, headers) =>
  new Response(JSON.stringify(body), { status, headers: { ...headers, 'Content-Type': 'application/json' } });

async function handleStats(request, env) {
  const headers = cors(env, request);
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });
  if (request.method !== 'GET') return json({ error: 'Method not allowed' }, 405, headers);

  const url = new URL(request.url);
  const name = url.pathname.slice('/stats/'.length);
  if (!STATS.includes(name)) return json({ error: 'Unknown stats page' }, 404, headers);

  const token = request.headers.get('Authorization')?.match(/^Bearer (\S+)$/)?.[1];
  if (!token) return json({ error: 'Sign in required' }, 401, headers);
  if (!(await isAllowedUser(env, token))) return json({ error: 'Not allowed' }, 403, headers);

  if (!env.GOATCOUNTER_KEY) return json({ error: 'GoatCounter key is not configured' }, 502, headers);
  const upstream = await fetch(`https://${env.GOATCOUNTER_CODE}.goatcounter.com/api/v0/stats/${name}${url.search}`, {
    headers: { Authorization: `Bearer ${env.GOATCOUNTER_KEY}`, 'Content-Type': 'application/json', 'User-Agent': USER_AGENT },
  });
  // A bad GoatCounter key is a server problem, not a reason to sign the admin out
  if (upstream.status === 401 || upstream.status === 403) {
    return json({ error: 'GoatCounter rejected the API key' }, 502, headers);
  }
  return new Response(upstream.body, {
    status: upstream.status,
    headers: { ...headers, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}
