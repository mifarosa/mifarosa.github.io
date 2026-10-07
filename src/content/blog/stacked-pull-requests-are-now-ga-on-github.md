---
title: Stacked Pull Requests Are Now GA on GitHub
description: Stacked pull requests became generally available on every github.com plan on October 6, 2026. You can now split one large change into a chain of small pull requests, review each one on its own, and merge them in order.
date: 2026-10-07
tags:
  - github
  - stacked pull request
lang: en
draft: false
---

# Stacked pull requests became generally available on every github.com plan on October 6, 2026. You can now split one large change into a chain of small pull requests, review each one on its own, and merge them in order.

We have all seen the 2,000-line pull request. Reviewers skim it, approve it out of fatigue, and bugs slip through. The usual fix is to tell people to "keep PRs small", but when the work itself is big, small PRs that depend on each other have been painful to manage. Stacks are GitHub's native answer to that problem.

## What a stack is

A stack is a chain of pull requests where each one uses the previous one as its base branch. The first PR targets `main`, the second targets the first, and so on. Reviewers see only the diff of their own layer, not the whole change.

```plain
flowchart RL
    PR3["PR 3: security<br/>base: PR 2"] --> PR2["PR 2: config<br/>base: PR 1"]
    PR2 --> PR1["PR 1: build bump<br/>base: main"]
    PR1 --> MAIN["main<br/>default branch"]

```

Every layer can be reviewed at the same time, but the stack merges from the bottom up: PR 1 first, then PR 2, then PR 3.

## What's new at GA

The GA release fixes the friction points that made stacks awkward during the preview.

| Area | What changed |
| --- | --- |
| Rebasing | Approvals survive when a stack is rebased, and commits keep their cryptographic signatures |
| Merging | Each pull request gets its own merge commit instead of one grouped commit; users with bypass permissions can merge parts of a stack |
| Retargeting | When a base branch is deleted, the stack retargets itself automatically |
| Auto-merge | Several PRs in a stack can merge together once their requirements pass (rolling out gradually) |
| Navigation | Stack details stay visible in the PR header; `Shift+J` / `Shift+K` move between PRs; the timeline shows when a PR joins or leaves a stack |
| CLI | The CLI extension now supports Git worktrees, with faster setup and checkout |

GitHub also shared numbers from the preview: repositories that used stacks merged 9% more code and saw merge times improve by 5% ([GitHub Changelog](https://github.blog/changelog/2026-10-06-stacked-pull-requests-generally-available/)).

## Example: a Spring Boot 4 migration as a stack

Framework upgrades are where stacks pay off most. A Spring Boot 4 migration touches build files, configuration, security setup and tests at the same time. As one PR it is close to unreviewable. As a stack, it could look like this (an illustrative split, not an official recipe):

1. **Build bump.** Update the Spring Boot version and dependency versions in `pom.xml` or `build.gradle`, plus the minimal fixes needed to compile.
2. **Configuration.** Rename or move properties that changed, and update `@Configuration` classes.
3. **Security.** Adapt the security filter chain and auth configuration to the new APIs.
4. **Tests.** Fix broken tests and update test slices and test containers setup.
5. **Cleanup.** Remove deprecated code paths and compatibility shims.

Each layer goes to the reviewer who knows that area best. The security PR gets a careful security review instead of being buried under hundreds of lines of version bumps. If review feedback forces a change in layer 2, you rebase the stack, and approvals on the other layers stay in place.

```plain
// Layer 3 of the stack: only the security config changes in this PR
@Configuration
public class SecurityConfig {

    @Bean
    SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        // Keep this PR focused: auth rules only, no unrelated refactors
        http.authorizeHttpRequests(auth -> auth
                .requestMatchers("/actuator/health").permitAll()
                .anyRequest().authenticated());
        return http.build();
    }
}

```

## Tips before you adopt stacks

- **One concern per layer.** A layer should be reviewable in one sitting. If you have to explain two unrelated things in its description, split it.
- **Keep every layer green.** Each PR should build and pass tests on its own, so that merging the bottom of the stack early never breaks the main branch.
- **Put risky changes low.** Changes that others depend on, such as the build bump, go at the bottom where they get reviewed and merged first.
- **Check your branch rules.** Bypass permissions now affect who can merge parts of a stack, so review your branch protection settings.
- **Remember auto-merge is still rolling out.** Don't build your team process around it until it shows up in your repositories.

## Conclusion

Stacks turn "keep PRs small" from advice into something the platform supports. For large refactors and framework upgrades, they mean faster, more focused reviews and fewer rubber-stamp approvals. If your team already splits work into dependent branches by hand, now is a good time to try the native workflow.

**Source:** [Stacked pull requests generally available – GitHub Changelog, October 6, 2026](https://github.blog/changelog/2026-10-06-stacked-pull-requests-generally-available/)
