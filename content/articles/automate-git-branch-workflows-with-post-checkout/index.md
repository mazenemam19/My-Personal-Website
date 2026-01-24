---
title: "Automate Git Branch Workflows with Post-Checkout"
description: "Learn how to use Git hooks to automate dependency synchronization, cache clearing, and environment setup every time you switch branches."
date: "2025-03-13"
banner:
  src: "./banner.jpg"
  alt: "Automate Git Branch Workflows with Post-Checkout"
categories:
  - "git"
  - "automation"
  - "bash"
  - "productivity"
keywords:
  - "git"
  - "automation"
  - "bash"
  - "productivity"
source: "Medium"
externalLink: "https://mazenemam19.medium.com/automate-git-branch-workflows-with-post-checkout-6c7f2abc8f0a"
---

Git branch switching is a fundamental part of the daily workflow for most developers. But how much time do you spend after switching branches, manually running commands to ensure your environment is correctly set up? Updating dependencies, clearing caches, restarting your dev server… it can quickly become repetitive and drain your focus.

What if you could automate these post-branch-switch tasks, freeing you to jump straight into coding? That's where Git's **post-checkout hook** comes to the rescue!

In this post, we'll explore how to create a powerful post-checkout hook using Bash to automate common tasks whenever you switch Git branches. This script will handle:

*   **Ensuring you have the latest remote changes** — Automatically pulling updates (with safeguards!).
*   **Dependency synchronization** — Detecting changes in `package.json` or `pnpm-lock.yaml` and running `pnpm dev`.
*   **Vite cache clearing** — Prevents those frustrating Vite cache issues after branch switches.
*   **Automatic app restart** — Instantly get your development server up and running on the new branch's code.
*   **Colorized terminal output** — Providing clear, visual feedback on what the script is doing.
*   **Safety checks and confirmations** — Protecting against unintended actions and giving you control.

Ready to make your branch-switching experience seamless and boost your productivity? Let's dive into the script!

### The post-checkout Script in Action

Here's the complete Bash script we'll be building:

```bash
#!/bin/bash

# ANSI color codes
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
RESET='\033[0m'

# Only run on branch switches (not file checkouts)
if [ "$3" != "1" ]; then
  exit 0
fi

# Get branch names for old and new commits
OLD_BRANCH=$(git name-rev --name-only "$1")
NEW_BRANCH=$(git branch --show-current)

# Exit if we're moving between commits on the same branch
if [ "$OLD_BRANCH" = "$NEW_BRANCH" ]; then
  exit 0
fi

# Check and pull only if there are changes
echo -e "${CYAN}Checking for remote changes...${RESET}"
git remote update > /dev/null 2>&1
if git status -uno | grep -q 'Your branch is behind'; then
  echo -e "${CYAN}Pulling latest changes with 
	git pull
...
${RESET}"
  if ! git pull; then
    echo -e "${RED}❌ Failed to pull latest changes. Aborting.${RESET}"
    exit 1
  fi
else
  echo -e "${GREEN}Already up to date. Skipping pull.${RESET}"
fi

# Ask for confirmation before running the script
echo -e "${CYAN}Do you want to run the post-checkout script? (y/n)${RESET}"
exec < /dev/tty
read -r confirm
exec <&-

case $confirm in
    [Yy]) ;;
    *)
        echo -e "${YELLOW}Skipping post-checkout script.${RESET}"
        exit 0
        ;;
esac

echo -e "${CYAN}Checking for dependency changes after branch switch...${RESET}"

OLD_REV=$1
NEW_REV=$2

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  echo -e "${YELLOW}⚠️ node_modules not found. Forcing dependency installation...${RESET}"
  FORCE_INSTALL=1
fi

# Ensure commit references exist
if [ -z "$OLD_REV" ] || [ -z "$NEW_REV" ]; then
  echo -e "${YELLOW}⚠️ Missing commit references. Skipping dependency check.${RESET}"
else
  changed_files=$(git diff --name-only "$OLD_REV" "$NEW_REV" -- package.json pnpm-lock.yaml)

  if [ -n "$changed_files" ] || [ "$FORCE_INSTALL" = "1" ]; then
    echo -e "${YELLOW}Detected changes in: ${changed_files}${RESET}"
    echo -e "${CYAN}Running 
	pnpm install
 to sync dependencies...
${RESET}"
    if ! pnpm install; then
      echo -e "${RED}❌ Dependency installation failed. Aborting.${RESET}"
      exit 1
    fi

    if [ -d "node_modules/.vite" ]; then
      echo -e "${CYAN}Clearing Vite cache...${RESET}"
      rm -rf node_modules/.vite
    fi
  else
    echo -e "${GREEN}No dependency changes detected. Skipping install.${RESET}"
  fi
fi

# Always start the app
echo -e "${CYAN}Starting the app...${RESET}"
pnpm dev
```

---

### Let's break down what's happening step by step:

#### 1. Setting the Stage with Colorized Output
We start by defining ANSI color codes to make the script's output visually informative in your terminal:

```bash
# ANSI color codes
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
RESET='\033[0m'
```

These color codes will be used throughout the script to highlight messages (information, warnings, errors, success).

#### 2. Ensuring It's a Branch Switch, Not Just a File Checkout (Commit Checkout Within The Same Branch)
The post-checkout hook runs in various Git scenarios, including file checkouts. We only want this script to execute specifically when switching branches. This line checks the third argument (`$3`) passed to the hook:

```bash
# Only run on branch switches (not file checkouts)
if [ "$3" != "1" ]; then
  exit 0
fi
```

Git passes a `1` as the third argument when it's a branch checkout (as opposed to a file checkout or other types of checkout). This condition ensures the script only proceeds on branch switches, avoiding unnecessary executions in other Git operations.

#### 3. Handling Same-Branch Commits
If you switch between commits within the same branch, there's typically no need to re-run dependency installations or restart the app. This section efficiently checks for this scenario:

```bash
# Get branch names for old and new commits
OLD_BRANCH=$(git name-rev --name-only "$1")
NEW_BRANCH=$(git branch --show-current)

# Exit if we're moving between commits on the same branch
if [ "$OLD_BRANCH" = "$NEW_BRANCH" ]; then
  exit 0
fi
```

If the old and new branches are the same, the script exits early, saving time.

#### 4. Smartly Pulling the Latest Remote Changes
Staying up-to-date with remote changes is crucial, especially when switching branches in a collaborative environment. This section handles pulling remote changes, but with a bit of smartness:

```bash
# Check and pull only if there are changes
echo -e "${CYAN}Checking for remote changes...${RESET}"
git remote update > /dev/null 2>&1
if git status -uno | grep -q 'Your branch is behind'; then
  echo -e "${CYAN}Pulling latest changes with 
	git pull
...
${RESET}"
  if ! git pull; then
    echo -e "${RED}❌ Failed to pull latest changes. Aborting.${RESET}"
    exit 1
  fi
else
  echo -e "${GREEN}Already up to date. Skipping pull.${RESET}"
fi
```

Instead of blindly running `git pull` every time (which can be slow and sometimes unnecessary), it first checks if your branch is actually behind the remote using `git remote update` and `git status -uno`. Only if there are remote changes will it proceed with `git pull`. This optimization can save valuable seconds on each branch switch.

#### 5. Confirmation Before Running the Script (User Control)
While automation is fantastic for most branch switches, there are situations where you might want to switch branches without immediately running all the automated tasks. Think about it: sometimes you're just switching to a `develop` or `staging` branch to quickly merge your feature branch – maybe you're planning to test it in a remote environment first, rather than running everything locally right away. (Hush, don't tell your senior I mentioned pushing without testing locally first 🤫🤫)

To give you this kind of flexibility and speed when you need it, this section adds a confirmation prompt:

```bash
# Ask for confirmation before running the script
echo -e "${CYAN}Do you want to run the post-checkout script? (y/n)${RESET}"
exec < /dev/tty
read -r confirm
exec <&-

case $confirm in
    [Yy]) ;;
    *)
        echo -e "${YELLOW}Skipping post-checkout script.${RESET}"
        exit 0
        ;;
esac
```

This provides a Cyan-colored prompt: "Do you want to run the post-checkout script? (y/n)". If you don't enter "y" or "Y", the script will gracefully exit, skipping the dependency checks and app restart.

#### 6. Dependency Change Detection and Synchronization
This is where the script becomes truly smart, automatically managing your project's dependencies whenever you switch branches. Here's how it handles this:

```bash
echo -e "${CYAN}Checking for dependency changes after branch switch...${RESET}"

OLD_REV=$1
NEW_REV=$2

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  echo -e "${YELLOW}⚠️ node_modules not found. Forcing dependency installation...${RESET}"
  FORCE_INSTALL=1
fi

# Ensure commit references exist
if [ -z "$OLD_REV" ] || [ -z "$NEW_REV" ]; then
  echo -e "${YELLOW}⚠️ Missing commit references. Skipping dependency check.${RESET}"
else
  changed_files=$(git diff --name-only "$OLD_REV" "$NEW_REV" -- package.json pnpm-lock.yaml)
  if [ -n "$changed_files" ] || [ "$FORCE_INSTALL" = "1" ]; then
    echo -e "${YELLOW}Detected changes in: ${changed_files}${RESET}"
    echo -e "${CYAN}Running 
	pnpm install
 to sync dependencies...
${RESET}"
    if ! pnpm install; then
      echo -e "${RED}❌ Dependency installation failed. Aborting.${RESET}"
      exit 1
    fi
    if [ -d "node_modules/.vite" ]; then
      echo -e "${CYAN}Clearing Vite cache...${RESET}"
      rm -rf node_modules/.vite
    fi
  else
    echo -e "${GREEN}No dependency changes detected. Skipping install.${RESET}"
  fi
fi
```

##### Breaking Down the Intelligent Dependency Management
*   **Ensuring `node_modules` Exists:** The script first checks if the `node_modules` directory is present. If it's missing—like in a fresh project clone—it automatically forces a dependency installation, ensuring your project is ready to go.
*   **Detecting Dependency File Changes:** Using `git diff --name-only`, the script checks if `package.json` or `pnpm-lock.yaml` (or your package manager's lock file) has changed between branches. If any of these files have been modified, dependencies need to be reinstalled.
*   **Smart `pnpm install` Execution:** If dependency files have changed or `node_modules` is missing, the script runs `pnpm install`, keeping dependencies in sync without unnecessary installations, saving time on branch switches.
*   **Vite Cache Clearing (Optional but Recommended):** When `pnpm install` succeeds, the script clears the Vite cache (`node_modules/.vite`), preventing potential build issues from outdated cache data.

This smart dependency synchronization ensures that whenever you switch branches, your project's dependencies are automatically updated and ready to go, letting you focus on coding without worrying about manual dependency management.

#### 7. Always Starting the App
Finally, regardless of dependency changes, the script concludes by automatically starting your development application:

```bash
# Always start the app
echo -e "${CYAN}Starting the app...${RESET}"
pnpm dev
```

This ensures that after switching branches (and potentially updating dependencies and clearing the cache), your development server is immediately launched, ready for you to start coding on the new branch.

#### 8. Setting up the post-checkout Hook
To use this script, you need to place it in the `.git/hooks` directory of your Git repository and make it executable:

1.  Navigate to your project's root directory in your terminal.
2.  Create the `post-checkout` file (if it doesn't exist) within `.git/hooks`:
    ```bash
    touch .git/hooks/post-checkout
    ```
3.  Copy and paste the entire script code into the `.git/hooks/post-checkout` file.
4.  Make the script executable:
    ```bash
    chmod +x .git/hooks/post-checkout
    ```

---

### Bonus: See It Working

![](./images/image-1.webp)
![](./images/image-2.webp)
![](./images/image-3.webp)
![](./images/image-4.webp)
![](./images/image-5.webp)

---

### Make It YOUR Own:
This script is a starting point! Customize it for your workflow:
*   🔧 Replace `pnpm` with `yarn`/`npm` if needed
*   🔧 Notify Slack/Teams
*   🔧 Add your secret sauce!

---

### Conclusion:
By setting up this post-checkout hook, you can dramatically streamline your Git branch switching workflow. No more manually running `git pull`, `pnpm dev`, and restarting your dev server every time you change branches! This automation frees up your mental energy and lets you focus on what truly matters: writing code and building amazing things.

Give this script a try in your projects and experience the smoother, more efficient branch-switching workflow it provides. Let me know in the comments if you have any questions or further enhancements you'd like to share!

*This post was originally published on [Medium](https://mazenemam19.medium.com/automate-git-branch-workflows-with-post-checkout-6c7f2abc8f0a).*