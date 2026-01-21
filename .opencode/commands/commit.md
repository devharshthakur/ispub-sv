---
description: Analyze changes and create git commit with user approval
agent: build
---

Please help me create a git commit by analyzing the current changes and asking for my approval.

First, let's check the current git status and see what changes are staged and unstaged:
!`git status`

Now let's see the actual changes that will be committed:
!`git diff --cached`

And any unstaged changes:
!`git diff`

Also check for any untracked files:
!`git ls-files --others --exclude-standard`

Based on these changes, please:

1. Analyze all tracked and untracked changes
2. Create an appropriate git commit title (50 characters or less) that follows conventional commit format when applicable
3. Write a detailed commit description that explains:
   - What changes were made
   - Why these changes are necessary
4. Ask for my approval to proceed with the commit
5. If I want to make changes, allow me to modify the commit message
6. If I approve, execute the git commit command

Please present this in a clear format and wait for my confirmation before actually committing.
