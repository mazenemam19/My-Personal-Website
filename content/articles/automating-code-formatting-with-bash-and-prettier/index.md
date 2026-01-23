---
title: "Automating Code Formatting with Bash and Prettier"
description: "Automating Code Formatting with Bash and Prettier..."
date: "2023-06-22"
banner:
  src: "./banner.jpg"
  alt: "Automating Code Formatting with Bash and Prettier"
categories:
  - "productivity"
  - "software-development"
  - "programming"
  - "web-development"
  - "clean-code"
keywords:
  - "productivity"
  - "software-development"
  - "programming"
  - "web-development"
  - "clean-code"
source: "Medium"
externalLink: "https://mazenemam19.medium.com/automating-code-formatting-with-bash-and-prettier-f5f951e1522f?source=rss-17340371ff6------2"
---

Code formatting can be a tedious and time-consuming task, but it's also an essential part of writing clean and maintainable code. Inconsistent formatting can make it difficult to read and understand code and can even introduce bugs or errors.

Fortunately, there are tools available that can automate code formatting and ensure consistency across your codebase. `Prettier` is one such tool, and it's become a popular choice among developers for its ease of use and flexibility.

In this tutorial, I'll show you how to configure `Prettier` to automatically format your code using a pre-commit hook and a configuration file, including how to use a local configuration file to override a global configuration file.

### Step 1: Install Prettier

The first step is to install `Prettier` in your project. You can do this using `npm` or `yarn`:

```bash
npm install --save-dev --save-exact prettier
``````

or

```bash
yarn add --dev --exact prettier
``````

This installs `Prettier` as a development dependency in your project and ensures that you have a specific version of `Prettier` installed that will not change unexpectedly.

### Step 2: Create a Global Prettier Configuration File

Next, you'll need to create a global configuration file for `Prettier`. This file tells `Prettier` how to format your code and allows you to customize the formatting options to suit your preferences.

Create a file called `.prettierrc` in the root of your project, and add the following contents:

```json
{
  "trailingComma": "es5",
  "tabWidth": 2,
  "semi": true,
  "singleQuote": true
}
```

This configuration specifies that `Prettier` should use a comma after the last element in an array or object (using the "es5" option), use 2 spaces for indentation, add semicolons at the end of statements, and use single quotes for strings.

You can customize these options to suit your project's coding style and conventions. For a full list of options and their values, see the [`Prettier` documentation](https://prettier.io/docs/en/options.html).

### Step 3: Create a Local Prettier Configuration File

When working on a project with an existing `.prettierrc` configuration, you may find that the formatting is difficult to read and work with or doesn't match your personal preferences. For example, the line width may be set to 80, which can be too small for some screen sizes and cause discomfort when reading the code. To address this issue, you can create a local configuration file that allows you to override the global Prettier configuration and customize the formatting options to your preferences.

To create a local configuration file, create a file called `.prettierrc.local.json` in the root of your project and specify the desired formatting options. For example, you can set the tab width to 4 spaces instead of the 2 spaces specified in the global configuration. This ensures that your code is formatted according to your preferences without affecting the formatting of other files in the project.

```json
{
  "tabWidth": 4,
  "printWidth": 120
}
```

This configuration specifies that `Prettier` should use 4 spaces for indentation, instead of the 2 spaces specified in the global configuration, and change the line width to 120 instead of the default 80 characters.

Additionally, to ensure that your changes to the code do not cause unnecessary formatting changes when committing the code, we will use a pre-commit hook. This hook runs `Prettier` on the files that are about to be committed and ensures that they are formatted according to `.prettierrc` configuration file. This way, your code is formatted according to your preferences while still maintaining consistency with the project's overall formatting standards.

### Step 4: Configure VS Code to Use the Local Configuration File

To use the local configuration file in `VS Code`, you need to add the prettier.configPath option to your `VS Code` settings. This tells the `Prettier` extension to use the local configuration file instead of the global configuration file.

To do this, open your `VS Code` settings (File > Preferences > Settings or using the shortcut `Ctrl+,`), and add the following line to your settings:

```json
{
  "prettier.configPath": "./.prettierrc.local.json"
}
```

This configuration specifies the path to the local configuration file.

### Step 5: Install the Prettier Extension in VS Code

To use `Prettier` in `VS Code`, you must also install the `Prettier` extension. The extension provides integration with `Prettier` and makes it easy to run `Prettier` on your code directly from the editor.

To install the Prettier extension, open the Extensions view in `VS Code` (View > Extensions or using the shortcut `Ctrl+Shift+X`), search for "Prettier -- Code formatter", and click the Install button.

### Step 6: Create a Pre-Commit Hook

Now that `Prettier` is installed and configured, you can create a pre-commit hook that will automatically run `Prettier` on your code before each commit and ensure that all code is properly formatted.

Create a file called `.git/hooks/pre-commit` (without a file extension) in your project, and add the following contents:

```bash
#!/bin/bash

# Get the list of files added or modified in this commit
files=$(git diff --cached --name-only --diff-filter=ACM | grep "\.js$")

# If there are no JavaScript files, exit without doing anything
if [ -z "$files" ]; then
  exit 0
fi

# Run Prettier on the changed files using the shared configuration file
echo "Running Prettier on the following files:"
echo "$files"
for file in $files; do
  npx --no-install prettier --config .prettierrc --write "$file"
  git add "$file"
done
```

This script does the following:

*   It uses `Git` to determine which files have been modified and staged for commit and filters the list to include only `JavaScript` and `JSX` files.
*   It runs `Prettier` on the staged files using both the global configuration file and the local configuration file and writes the corrected formatting back to the files.
*   It uses `Git` to add the modified files back to the index so that the corrected formatting is included in the commit.
*   It prints a message to the console indicating that `Prettier` has formatted the code.
*   This script ensures that all staged `JavaScript` and `JSX` files are automatically formatted with `Prettier` before each commit, using both the global and local configuration files.

Make sure to make the pre-commit hook executable by running the following command in your `bash terminal`:

```bash 
chmod +x .git/hooks/pre-commit
```

### Step 7: Test the Pre-Commit Hook

To test the pre-commit hook, you can create a test commit that introduces some formatting errors in your code and see if the hook detects and fixes them before the commit is made.

Here's an example workflow for testing the pre-commit hook:

1\. Create a new file called `test.js` in your project directory and add some intentionally bad formatting to it. For example:

```javascript
const test=()=>{console.log('test');}
```

2\. Stage the file for commit using `git add `test.js`` .

3\. Attempt to commit the changes using `git commit -m "Test commit"`.

4\. If the pre-commit hook is working properly, it should detect the formatting errors in `test.js` and fix them automatically. The output in your terminal should look something like this:

```
Running Prettier on the following files:
test.js
[warn] `test.js` Code formatted with 1 warning
```

The [warn] message indicates that `Prettier` has detected a formatting error in the file, and the Code formatted with 1 warning message indicates that `Prettier` has corrected the formatting error.

### Conclusion

By following the steps in this tutorial, you can ensure that all of your code is consistently formatted without having to spend time manually formatting each file. This can save you time and reduce the risk of formatting-related errors in your code.

If you enjoy automating tasks in your development workflow, you might also be interested in my other post on [automating the creation of React components](https://mazenadel19.medium.com/automate-the-boring-stuff-in-react-ee9b215f907b).

I hope this tutorial has been helpful. If you have any questions or feedback, please let us know in the comments!

> **_Update:_** Excited to share that I've significantly enhanced this pre-commit hook! Read about the evolved version with `ESLint` integration, colorized output, and parallel processing in my new post:_ [_"_Level Up Your Pre-Commit Hook: Beyond Formatting_"_](https://mazenadel19.medium.com/level-up-your-pre-commit-hook-beyond-formatting-026c9b504af2)_._

*This post was originally published on [Medium](https://mazenemam19.medium.com/automating-code-formatting-with-bash-and-prettier-f5f951e1522f).*
