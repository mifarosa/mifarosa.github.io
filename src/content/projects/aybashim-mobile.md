---
title: aybashim mobile
subtitle: Serverless personal finance app for your phone
period: "2026"
status: Active
tags: [PWA, Vue 3, Vite, IndexedDB, pdf.js]
repo: https://github.com/mifarosa/aybashim_mobile
demo: https://aybashim.mifarosa.com
icon: /apps/aybashim.png
featured: true
order: 6
---
The phone version of aybashim, with no server, account or backend. Bank statements are read on the device, transactions are categorized automatically and the app shows monthly income and expense summaries, a spending breakdown and six months of cash flow. Reads ING account and credit card statements, A101 Hadi (PDF) and Garanti BBVA (XLS) exports, with the bank detected automatically.

The bank parsers and category rules are ports of the web version, refined with real statements. Duplicate protection on import, separate handling of transfers between your own accounts, refunds netted against the matching category, and JSON backup and restore. Data stays in the browser on the device (IndexedDB). Installable on Android and iOS and works offline.
