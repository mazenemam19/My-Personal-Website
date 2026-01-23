---
title: "Level Up Your Pre-Commit Hook: Beyond Formatting"
description: "Level Up Your Pre-Commit Hook: Beyond Formatting..."
date: "2025-03-03"
banner:
  src: "./banner.jpg"
  alt: "Level Up Your Pre-Commit Hook: Beyond Formatting"
categories:
  - "software-development"
  - "productivity"
  - "programming"
  - "clean-code"
  - "web-development"
keywords:
  - "software-development"
  - "productivity"
  - "programming"
  - "clean-code"
  - "web-development"
source: "Medium"
externalLink: "https://mazenemam19.medium.com/level-up-your-pre-commit-hook-beyond-formatting-026c9b504af2?source=rss-17340371ff6------2"
---

It's been almost two years since I first published **`Automating Code Formatting with Bash and Prettier`**. If you're new to the idea of using `Git` pre-commit hooks and `Prettier` for automatic formatting, I highly recommend taking a quick look at that [original post](https://mazenadel19.medium.com/automating-code-formatting-with-bash-and-prettier-f5f951e1522f) first -- it lays the foundation for what we're about to explore today.

For those already familiar with that initial setup or ready to dive straight into the advanced features, buckle up! Because wow, has that little script evolved ever since!

While automatic formatting is a fantastic first step towards cleaner code, I started thinking: What if we could catch even more issues at the commit stage? Formatting is great for consistency, but what about code quality? That question sparked a journey of enhancements to my pre-commit hook, turning it into a more powerful and robust tool for any project.

Today, I want to walk you through the exciting upgrades that have transformed this script. We're moving beyond just `Prettier` and diving into:

*   **`ESLint` Integration:** Catching stylistic issues and potential code errors before they land in your codebase.
*   **Visually Enhanced Output:** Colorized logging for instant clarity and feedback in your `terminal`.
*   **Parallel Processing:** This makes the hook significantly faster, especially for larger projects.
*   **Expanded File Type Support:** Embracing `TypeScript` and more!

This is what our final script will look like:

```bash
#!/bin/bash

# Define color codes RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Log start time echo -e "${YELLOW}Pre-commit hook started at $(date "+%Y-%m-%d %H:%M:%S")${NC}"
echo

# Get the list of files added or modified in this commit files=$(git diff --cached --name-only --diff-filter=ACM | grep -E "\.js$|\.jsx$|\.ts$|\.tsx$")

# If there are no JavaScript/JSX, TypeScript/TSX files, exit without doing anything if [ -z "$files" ]; then
  echo -e "${YELLOW}No `JavaScript/JSX`, `TypeScript/TSX` files to process. Exiting.${NC}"
  exit 0 fi

# Check if Prettier and ESLint are installed if ! npx prettier --version &> /dev/null; then
  echo -e "${RED}`Prettier` is not installed. Please install it by running ``npm install --save-dev prettier`` or ``yarn add --dev prettier``.${NC}"
  exit 1 fi

if ! npx eslint --version &> /dev/null; then
  echo -e "${RED}ESLint is not installed. Please install it by running 'npm install --save-dev eslint' or 'yarn add --dev eslint'.${NC}"
  exit 1 fi echo -e "${YELLOW}Prettier and ESLint are installed.${NC}"
echo

# Track if there were any ESLint failures eslint_failed=false eslint_error_details=""

# Determine the number of CPU cores num_cores=$(`nproc --all`) # On `Linux`

# Set the number of parallel processes parallel_processes=$((num_cores > 4 ? num_cores : 4)) # Ensure at least 4 parallel processes

# Define a function to process a file with Prettier and ESLint process_file() {
  local file=$1
  local filename=$(basename "$file")

  # Use echo directly to ensure color codes are preserved
  echo -e "${YELLOW}Processing $filename with Prettier...${NC}"
  npx prettier --config .prettierrc --write "$file"
  if [ $? -ne 0 ]; then
    echo -e "${RED}Prettier failed on $file. Please fix the issues and try again.${NC}"
    exit 1
  fi

  echo -e "${YELLOW}Processing $filename with ESLint...${NC}"

  # Run ESLint and capture the output
  eslint_output=$(npx eslint "$file" --fix --format=unix 2>&1)
  eslint_exit_code=$?

  # Check if there are errors or both errors and warnings
  if [ $eslint_exit_code -ne 0 ]; then
    if echo "$eslint_output" | grep -q "error"; then
      echo -e "${RED}ESLint found errors in $file. Unstaging the file...${NC}"
      git reset "$file" # Unstage the file
      eslint_failed=true
      eslint_error_details="$eslint_error_details\n$file\n$(echo "$eslint_output" | grep "error")" # Capture errors
    elif echo "$eslint_output" | grep -q "warning"; then
      echo -e "${RED}ESLint found warnings and errors in $file. Unstaging the file...${NC}"
      git reset "$file" # Unstage the file
      eslint_failed=true
      eslint_error_details="$eslint_error_details\n$file\n$(echo "$eslint_output" | grep "warning")" # Capture warnings
    fi
  elif echo "$eslint_output" | grep -q "warning"; then
    echo -e "${GREEN}ESLint found warnings in $file, but no errors. Keeping file staged.${NC}"
    git add "$file" # Only add the file back if there are warnings but no errors
  else
    echo -e "${GREEN}$file passed ESLint checks and has been staged.${NC}"
    git add "$file"
  fi
}

export -f process_file
export eslint_failed
export eslint_error_details
export RED GREEN YELLOW NC

# Process files using `xargs` with parallel processing echo "$files" | xargs -P "$parallel_processes" -I {} bash -c 'process_file "$@"' {}

# Exit with a failure code if ESLint had issues if [ "$eslint_failed" = true ]; then
  echo -e "${RED}Some files failed ESLint checks and have been unstaged. Please fix the issues before committing.${NC}"
  echo -e "${RED}Error details:${NC}${eslint_error_details}"
  exit 1 fi

# Log end time echo -e "${GREEN}Pre-commit hook completed successfully at $(date "+%Y-%m-%d %H:%M:%S")${NC}"
exit 0
```

Ready to supercharge your pre-commit workflow? Let's dive in!

### 🎨 Seeing is Believing: Colorized Logging for Instant Feedback

Remember staring at plain text logs, trying to decipher success from failure? No more! We've brought color to the terminal output, making it instantly intuitive to understand what's happening during the pre-commit process.

Now, you'll see:

*   **Red for Errors:** Critical issues and failures jump right out at you.
*   **Green for Success:** A clear signal when everything's running smoothly.
*   **Yellow for Info/Warnings:** Important steps and less critical feedback are highlighted.

This visual language makes it incredibly easy to grasp the script's progress and pinpoint any problems. Setting this up is as simple as defining color codes at the top of your script:

```bash
# Define color codes RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color
```

And then using them within your echo commands like this:

```bash echo -e "${RED}`Prettier` failed on $file. Please fix the issues and try again.${NC}"
```

A small touch, but a huge win for usability!

### ⏱️ Time is Precious: Start and End Time Logging

For debugging, optimization, or just plain curiosity, knowing how long your pre-commit hook takes is valuable. We've added timestamps at the start and end of the script's execution. Now, you get clear output like:

```
Pre-commit hook started at 2024-07-27 10:30:00
... script execution ...
Pre-commit hook completed successfully at 2024-07-27 10:30:05
```

This simple addition helps you track execution time and spot potential bottlenecks.

### 🌐 Beyond JavaScript: Embracing TypeScript and More

The original script was laser-focused on `JavaScript`. But `let's` face it: `TypeScript` is a major player now (and for good reason!). To keep up with the times, we've broadened file type support to include `TypeScript` (``.ts``, ``.tsx``) files.

The file detection line now looks like this:

```bash files=$(git diff --cached --name-only --diff-filter=ACM | grep -E "\.js$|\.jsx$|\.ts$|\.tsx$")
```

This ensures your pre-commit checks cover a wider spectrum of modern web development projects. You could easily expand this further to include `CSS`, `JSON`, or other file types `Prettier` and `ESLint` can handle!

### 🛡️ The Code Quality Guardian: Introducing `ESLint`

This is the game-changer. We've leveled up from just formatting to enforcing code quality by integrating `ESLint` into our pre-commit hook! `ESLint` is your vigilant code quality guardian, catching stylistic inconsistencies and potential runtime errors.

Here's how ESLint is now woven into the script:

*   **Installation Check:** The script now proactively verifies if `ESLint` is installed as a dev dependency. There will be no more surprises if `ESLint` isn't set up! Clear instructions are provided if it's missing:

```bash
if ! npx eslint --version &> /dev/null; then   
  echo -e "${RED}ESLint is not installed. Please install it by running 'npm install --save-dev eslint' or 'yarn add --dev eslint'.${NC}"   
  exit 1 
fi
```

If you don't know how to setup `eslint` in your project, you can [start here](https://eslint.org/docs/latest/use/getting-started#quick-start)

*   **Automated Linting & Fixing:** For each relevant file, `ESLint` is executed with the `--fix` flag, automatically correcting many linting issues.

```bash
echo -e "${YELLOW}Processing $filename with ESLint...${NC}" 

# Run ESLint and capture the output eslint_output=$(npx eslint "$file" --fix --format=unix 2>&1) 
eslint_exit_code=$?


# Check if there are errors or both errors and warnings
  if [ $eslint_exit_code -ne 0 ]; then
    if echo "$eslint_output" | grep -q "error"; then
      echo -e "${RED}ESLint found errors in $file. Unstaging the file...${NC}"
      git reset "$file" # Unstage the file
      eslint_failed=true
      eslint_error_details="$eslint_error_details\n$file\n$(echo "$eslint_output" | grep "error")" # Capture errors
    elif echo "$eslint_output" | grep -q "warning"; then
      echo -e "${RED}ESLint found warnings and errors in $file. Unstaging the file...${NC}"
      git reset "$file" # Unstage the file
      eslint_failed=true
      eslint_error_details="$eslint_error_details\n$file\n$(echo "$eslint_output" | grep "warning")" # Capture warnings
    fi
  elif echo "$eslint_output" | grep -q "warning"; then
    echo -e "${GREEN}ESLint found warnings in $file, but no errors. Keeping file staged.${NC}"
    git add "$file" # Only add the file back if there are warnings but no errors
  else
    echo -e "${GREEN}$file passed ESLint checks and has been staged.${NC}"
    git add "$file"
  fi
```

**Smart Error and Warning Handling:** This is where it gets clever. The script analyzes `ESLint`'s output to differentiate between errors and warnings:

*   **Errors Halt Commits:** If `ESLint` finds errors, the script acts decisively. It unstages the offending file, displays a red error message, captures the error details, and aborts the commit. No bad code slips through!
*   **Warnings Provide Feedback:** If `ESLint` finds warnings but no errors, the script provides a green message, acknowledging the warnings but allowing the commit to proceed (assuming `Prettier` is happy, too).

This nuanced approach allows you to enforce strict error-free code commits while still being aware of (and potentially addressing later) less critical warnings.

### ⚡️ Speed Boost: Parallel Processing with `xargs`

For those of us working on larger projects, efficiency is key. Running formatters and linters sequentially can add up. To tackle this, we've implemented parallel processing using the trusty `xargs` command!

```bash
# Determine the number of CPU cores num_cores=$(`nproc --all`) # On `Linux`
# Set the number of parallel processes parallel_processes=$((num_cores > 4 ? num_cores : 4)) # Ensure at least 4 parallel processes
# Process files using `xargs` with parallel processing echo "$files" | xargs -P "$parallel_processes" -I {} bash -c 'process_file "$@"' {}
```

The script now intelligently detects the number of CPU cores on your machine and leverages them to run Prettier and ESLint on multiple files at the same time. This parallel execution can drastically reduce the pre-commit hook's runtime, keeping your workflow smooth and speedy.

### 📝 End-of-Run Error Summary

Finally, if any `ESLint` errors block the commit, the script now provides a concise summary of those errors at the very end. This gives you a clear, consolidated overview of what needs fixing right in your `terminal` output. No hunting through logs!

```bash
if [ "$eslint_failed" = true ]; then
  echo -e "${RED}Some files failed ESLint checks and have been unstaged. Please fix the issues before committing.${NC}"
  echo -e "${RED}Error details:${NC}${eslint_error_details}"
  exit 1 
fi
```

### Conclusion:

**Your Code Quality Wingman.** These updates elevate the pre-commit hook from a simple formatting tool to a powerful code quality checkpoint. By integrating `ESLint`, adding visual cues with color, boosting speed with parallel processing, and expanding file support, this enhanced script becomes an even more indispensable part of your development workflow.

Automating these checks right at the commit stage is a fantastic way to catch issues early, maintain code consistency, and foster a healthier codebase overall. Give this updated script a try -- you might be surprised how much smoother and more confident your development process becomes!

*This post was originally published on [Medium](https://mazenadel19.medium.com/level-up-your-pre-commit-hook-beyond-formatting-026c9b504af2?source=rss-17340371ff6------2).*
