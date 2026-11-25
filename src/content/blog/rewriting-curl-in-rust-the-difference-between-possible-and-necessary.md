---
title: 'Rewriting curl in Rust: The Difference Between Possible and Necessary'
description: "As AI tools have improved, an idea that had long been a running joke has become real: rewriting curl in Rust. On November 17, 2026, curl's creator, Daniel Stenberg, responded to this development in a post on his blog."
date: 2026-11-25
tags:
  - curl
  - ai
  - Daniel Stenberg
  - rewrite
  - urlx
  - rust
lang: en
draft: false
---

According to Stenberg, a Rust rewrite called urlx appeared a few months ago. In November, a new project that uses the curl name and reportedly cost about $8,600 was released. In roughly three weeks, AI agents converted about 185,000 lines of C into about 340,000 lines of Rust.

**Stenberg's argument**

Stenberg argues that writing the code once was never the hard part. Even the fact that these rewrites could succeed rests on curl being well documented, widely used through its API, and backed by thousands of tests. In other words, these projects lean on the knowledge curl has built up over the years.

In his view, curl's real value lies in the decisions made over decades, in feedback from its users, and in continuous improvement. What keeps it competitive is a working community.

**What do the numbers say?**

During the roughly three weeks the rewrites took, the original curl project merged more than 300 commits, about 200 of which were bug fixes.

On security, Stenberg shares this figure: of the 81 vulnerabilities confirmed in curl in 2026, 14 would likely not have occurred had it been written in a memory-safe language. In other words, even with a move to Rust, 67 vulnerabilities would still exist. This shows that Rust eliminates one class of bugs but does not solve security as a whole.

**Conclusion**

Stenberg says he does not believe in rewrites and prefers continuous polishing and refactoring instead. He says he has not been in touch with the authors of the rewrites and wonders whether their projects are more than proofs of concept. Still, he wishes them luck, and he finds the situation amusing, puzzling, and fascinating.

The question the post raises is not only about curl: now that we can cheaply reproduce something, does that make reproducing it worthwhile?

_Original post:_ [_https://daniel.haxx.se/blog/2026/11/17/actual-curl-rewrites-in-rust/_](https://daniel.haxx.se/blog/2026/11/17/actual-curl-rewrites-in-rust/)
