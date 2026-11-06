---
title: git_hint_search
subtitle: Find deleted files in git history and restore them
period: Nov 2026
status: Released
tags: [Python, CLI, Git]
repo: https://github.com/mifarosa/git_hint_search
featured: true
order: 12
---
An interactive terminal tool for the moment you remember a piece of a file but not where it went. Browse to a folder with the arrow keys, type a hint such as part of a file name or a line of code, and it searches the git history of that folder across all branches. Every match is marked as added, removed or deleted, with the commit, date and author.

Narrow the search to the file formats you care about, then view a result, save a copy, or restore it to its original place in the project. Nothing is overwritten silently: if the file already exists you can overwrite it, keep both or skip. It can also dig out content that no commit points to any more, for example after a `git reset --hard`. A single Python file with no dependencies.
