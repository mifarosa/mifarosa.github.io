// Sveltia CMS configuration, served as /admin/cms/config.json.
// Built from code so the sign-in URL comes from src/data/analytics.ts. Field lists mirror the
// schemas in src/content.config.ts and the shape of src/data/profile.json; keep them in sync.
import type { APIRoute } from 'astro';
import { adminApiUrl } from '../../../data/analytics';

const tagList = (label: string) => ({
  name: 'tags', label, widget: 'list', required: false, default: [],
});

const blog = {
  name: 'blog',
  label: 'Blog yazıları',
  label_singular: 'Blog yazısı',
  folder: 'src/content/blog',
  create: true,
  slug: '{{slug}}',
  extension: 'md',
  format: 'frontmatter',
  media_folder: '/public/blog/images',
  public_folder: '/blog/images',
  preview_path: 'blog/{{slug}}',
  sortable_fields: ['date', 'title'],
  summary: "{{title}} · {{date | date('YYYY-MM-DD')}}",
  fields: [
    { name: 'title', label: 'Başlık', widget: 'string' },
    { name: 'description', label: 'Kısa açıklama', widget: 'text', hint: 'Blog listesinde ve link önizlemelerinde görünür.' },
    { name: 'date', label: 'Tarih', widget: 'datetime', type: 'date', format: 'YYYY-MM-DD', default: '{{now}}' },
    tagList('Etiketler'),
    {
      name: 'lang', label: 'Dil', widget: 'select', default: 'en',
      options: [{ label: 'English', value: 'en' }, { label: 'Türkçe', value: 'tr' }],
    },
    { name: 'draft', label: 'Taslak', widget: 'boolean', default: false, hint: 'Açıksa yazı sitede görünmez.' },
    { name: 'originalUrl', label: 'İlk yayınlandığı adres', widget: 'string', required: false, hint: 'Yazı önce başka bir yerde yayınlandıysa (ör. mfgstudiosblog.com).' },
    { name: 'body', label: 'Yazı', widget: 'markdown' },
  ],
};

const projects = {
  name: 'projects',
  label: 'Projeler',
  label_singular: 'Proje',
  folder: 'src/content/projects',
  create: true,
  slug: '{{slug}}',
  extension: 'md',
  format: 'frontmatter',
  media_folder: '/public/apps',
  public_folder: '/apps',
  sortable_fields: ['order', 'title'],
  fields: [
    { name: 'title', label: 'Ad', widget: 'string' },
    { name: 'subtitle', label: 'Tek satırlık açıklama', widget: 'string' },
    { name: 'period', label: 'Dönem', widget: 'string', hint: 'Ör. Oct 2026' },
    {
      name: 'status', label: 'Durum', widget: 'select', default: 'Active',
      options: ['Active', 'Beta', 'Released', 'Archived'],
    },
    { ...tagList('Teknolojiler'), required: true, default: undefined },
    { name: 'repo', label: 'Kaynak kod adresi', widget: 'string', required: false },
    { name: 'demo', label: 'Uygulama adresi', widget: 'string', required: false, hint: 'Doluysa proje Apps menüsünde de görünür.' },
    { name: 'icon', label: 'Uygulama ikonu', widget: 'image', required: false },
    { name: 'featured', label: 'Ana sayfada göster', widget: 'boolean', default: false },
    { name: 'order', label: 'Sıra', widget: 'number', value_type: 'int', default: 100, hint: 'Küçük olan önce gelir.' },
    { name: 'body', label: 'Açıklama', widget: 'markdown' },
  ],
};

const games = {
  name: 'games',
  label: 'Oyunlar',
  label_singular: 'Oyun',
  folder: 'src/content/games',
  create: true,
  slug: '{{slug}}',
  extension: 'md',
  format: 'frontmatter',
  media_folder: '/public/games',
  public_folder: '/games',
  sortable_fields: ['order', 'title'],
  fields: [
    { name: 'title', label: 'Ad', widget: 'string' },
    { name: 'subtitle', label: 'Tek satırlık açıklama', widget: 'string' },
    { name: 'play', label: 'Oyun adresi', widget: 'string' },
    { name: 'repo', label: 'Kaynak kod adresi', widget: 'string', required: false },
    { name: 'icon', label: 'İkon', widget: 'image', required: false, hint: 'Kare, 192×192 PNG.' },
    { name: 'cover', label: 'Ekran görüntüsü', widget: 'image', required: false, hint: '16:9, Games sayfasında kartın üstünde görünür.' },
    tagList('Teknolojiler'),
    { name: 'order', label: 'Sıra', widget: 'number', value_type: 'int', default: 100, hint: 'Küçük olan önce gelir.' },
    { name: 'body', label: 'Açıklama', widget: 'markdown' },
  ],
};

const text = (name: string, label: string, extra = {}) => ({ name, label, widget: 'string', ...extra });
const strings = (name: string, label: string) => ({ name, label, widget: 'list' });

const profile = {
  name: 'site',
  label: 'Profil ve CV',
  files: [
    {
      name: 'profile',
      label: 'Profil ve CV',
      file: 'src/data/profile.json',
      format: 'json',
      media_folder: '/public/cv',
      public_folder: '/cv',
      fields: [
        {
          name: 'profile', label: 'Profil', widget: 'object', fields: [
            text('name', 'Ad soyad'),
            text('title', 'Unvan'),
            text('location', 'Konum'),
            { name: 'headline', label: 'Ana sayfa giriş cümlesi', widget: 'text' },
            { name: 'summary', label: 'Özet', widget: 'text' },
            { name: 'cvUrl', label: 'CV (PDF)', widget: 'file', required: false, hint: 'Boş bırakılırsa "Download CV" butonu gizlenir.' },
          ],
        },
        {
          name: 'contact', label: 'İletişim', widget: 'object', fields: [
            strings('emails', 'E-postalar'),
            text('linkedin', 'LinkedIn'),
            strings('github', 'GitHub hesapları'),
            text('blog', 'Eski blog'),
            text('newsletter', 'Bülten'),
          ],
        },
        {
          name: 'experience', label: 'Deneyim', widget: 'list', summary: '{{company}} · {{role}}', fields: [
            text('company', 'Şirket'),
            text('role', 'Pozisyon'),
            text('period', 'Dönem'),
            text('type', 'Çalışma şekli', { hint: 'Full-time, Part-time, Internship…' }),
            strings('points', 'Maddeler'),
            strings('tags', 'Teknolojiler'),
          ],
        },
        {
          name: 'skills', label: 'Yetenekler', widget: 'list', summary: '{{group}}', fields: [
            text('group', 'Grup'),
            strings('items', 'Öğeler'),
          ],
        },
        strings('certifications', 'Sertifikalar'),
        {
          name: 'education', label: 'Eğitim', widget: 'list', summary: '{{school}}', fields: [
            text('school', 'Okul'),
            text('degree', 'Bölüm / derece'),
            text('period', 'Dönem'),
            { name: 'detail', label: 'Detay', widget: 'text' },
          ],
        },
        {
          name: 'leadership', label: 'Topluluk ve liderlik', widget: 'list', summary: '{{org}} · {{role}}', fields: [
            text('org', 'Kurum'),
            text('role', 'Rol'),
            text('period', 'Dönem'),
            { name: 'detail', label: 'Detay', widget: 'text' },
          ],
        },
      ],
    },
  ],
};

export const config = {
  backend: {
    name: 'github',
    repo: 'mifarosa/mifarosa.github.io',
    branch: 'main',
    base_url: adminApiUrl,
    auth_scope: 'public_repo',
    commit_messages: {
      create: 'Add {{collection}} "{{slug}}" from admin',
      update: 'Update {{collection}} "{{slug}}" from admin',
      delete: 'Delete {{collection}} "{{slug}}" from admin',
      uploadMedia: 'Upload "{{path}}" from admin',
      deleteMedia: 'Delete "{{path}}" from admin',
    },
  },
  site_url: 'https://mifarosa.com',
  display_url: 'https://mifarosa.com',
  media_folder: '/public/images',
  public_folder: '/images',
  slug: { encoding: 'ascii', clean_accents: true },
  output: { omit_empty_optional_fields: true },
  collections: [blog, projects, games, profile],
};

export const GET: APIRoute = () =>
  new Response(JSON.stringify(config, null, 2), { headers: { 'Content-Type': 'application/json' } });
