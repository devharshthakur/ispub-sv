---
description: Create pull request from current branch to main
agent: build
model: anthropic/claude-3-5-sonnet-20241022
---

Please help me create a pull request from the current branch to main.

First, let's check the current git status and branch information:
!`git status`
!`git branch --show-current`
!`git remote -v`

Now let's see what changes will be included in the PR:
!`git log --oneline main..HEAD`
!`git diff main...HEAD --stat`

Check if the current branch is up to date with its remote counterpart:
!`git log --oneline origin/$(git branch --show-current)..HEAD`

Based on this information, please:

1. **Verify readiness**: Check if the branch is ready for PR creation (up to date, clean working directory)
2. **Push if needed**: If the branch isn't pushed to remote, push it first
3. **Analyze changes**: Review all commits and changes that will be in the PR
4. **Generate PR title**: Create a clear, descriptive title (following conventional commit format when applicable)
5. **Write PR description**: Include:
   - Summary of changes
   - Why these changes are needed
   - Any breaking changes or considerations
   - Testing instructions if applicable
6. **Ask for approval**: Show me the proposed PR title and description
7. **Create the PR**: If I approve, use `gh pr create` to create the pull request

Important notes:

- The PR should target the `main` branch
- Include relevant labels if they can be inferred from the changes suggest to user first if that label does not exist , you can any lable which best fits and try to match opensource stadards here if possible while choosing labels.
- Mention any related issues if referenced in commits
- If the branch needs to be pushed first, ask for confirmation before pushing

Please present everything clearly and wait for my confirmation before creating the actual PR.
