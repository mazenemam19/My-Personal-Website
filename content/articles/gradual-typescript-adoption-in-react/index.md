---
title: "Gradual TypeScript Adoption in React"
description: "Gradual TypeScript Adoption in React..."
date: "2025-02-23"
banner:
  src: "./banner.jpg"
  alt: "Gradual TypeScript Adoption in React"
categories:
  - "react"
  - "typescript"
  - "migration"
  - "best-practices"
keywords:
  - "react"
  - "typescript"
  - "migration"
  - "best-practices"
source: "Medium"
externalLink: "https://mazenemam19.medium.com/gradual-typescript-adoption-in-react-1bdb2b363722"
---

After maintaining a mid-sized `React` application for several years, our team decided to adopt `TypeScript`. Instead of a big-bang approach that would require rewriting the entire codebase, we chose a gradual migration strategy. In this article, I'll share our experience and provide a practical guide for teams looking to adopt `TypeScript` in their existing `React` applications.

### The Breaking Point: Why We Chose TypeScript

As our `React` application grew, we faced recurring issues that slowed development and compromised stability. Changes in one part of the app would often break functionality elsewhere, going unnoticed until runtime. Without type safety, our front end mistakenly treated optional API properties as mandatory, causing UI failures.

**These challenges became especially problematic when:  
**\- A single change to a shared component unexpectedly altered behavior across the app, sometimes breaking the UI  
\- API responses contained optional properties, but our frontend assumed they were always present, leading to errors  
\- Managing state transformations across different application layers became increasingly complex  
\- Refactoring shared components without clear type definitions introduced hidden bugs  
\- Onboarding new team members was difficult due to undocumented data structures and implicit contracts

After several production incidents caused by type mismatches, we realized we needed a more robust solution. `TypeScript` emerged as the clear choice to help us catch these issues during development rather than in production.

### Why Gradual Adoption?

The gradual adoption approach offers several benefits:  
\- Allows the team to learn `TypeScript` while continuing to deliver features  
\- Reduces the risk of introducing bugs during migration  
\- Provides immediate value through incremental improvements  
\- Maintains development velocity

### Step 1: Setting Up the `TypeScript` Infrastructure

#### Understanding Configuration Files

Let's break down the essential configuration files needed for `TypeScript` adoption.

#### 0\. Setting Up `TypeScript`

Before transitioning your project to `TypeScript`, install the necessary dependencies:

```bash
npm install --save-dev typescript @types/react @types/react-dom @typescript-eslint/eslint-plugin @typescript-eslint/parser @types/css-modules
```

#### Why These Packages?

\- **`typescript`** -- The core TypeScript compiler.

\- **@types/react** & **@types/react-dom**-- Provides `TypeScript` type definitions for `React`.

\- **@typescript-eslint/eslint-plugin** & **@typescript-eslint/parser** -- Enables `ESLint` to work with `TypeScript`.

\- **@types/css-modules** -- Provides type definitions for CSS Modules, ensuring styles can be imported without `TypeScript` errors.

#### Updating Scripts

If your project includes scripts that lint `JavaScript` files, update them to support .ts and .tsx files as well:

```json
"scripts": {
   "lint:fix": "eslint --fix --ext .js,.jsx,.ts,.tsx .",
   "lint:errors": "eslint --ext .js,.jsx,.ts,.tsx . --quiet",
   // Other Scripts
}
```

#### 1\. TypeScript Configurations

When migrating from `JavaScript` to `TypeScript`, the first step is setting up tsconfig.json. Before migration, our jsconfig.json was minimal:

```json
{
    "compilerOptions": {
        "baseUrl": "src"
    }
}
```

This allowed absolute imports but lacked type safety and other `TypeScript` features. After migration, we introduced a more robust tsconfig.json:

```json
{
    "compilerOptions": {
        "target": "ESNext", // Compiles to modern JavaScript (ESNext)
        "useDefineForClassFields": true, // Ensures correct behavior for class fields
        "lib": ["DOM", "DOM.Iterable", "ESNext"], // Includes necessary libraries
        "allowJs": true, // Allows JavaScript files in the project
        "skipLibCheck": true, // Skips type checking of declaration files for performance
        "esModuleInterop": false, // Ensures compatibility with ES6 modules
        "allowSyntheticDefaultImports": true, // Enables default imports for modules without a default `export`
        "strict": true, // Enables all strict type-checking options
        "forceConsistentCasingInFileNames": true, // Prevents case-sensitive `import` mismatches
        "module": "ESNext", // Uses the latest module system
        "moduleResolution": "Node", // Resolves modules like Node.js does
        "resolveJsonModule": true, // Allows importing JSON files
        "isolatedModules": true, // Ensures each file is treated as a separate module
        "noEmit": true, // Prevents `TypeScript` from emitting compiled `JavaScript` files
        "jsx": "react", // Use "react-jsx" for React 17+ to enable the new JSX transform
        "baseUrl": "src" // Enables absolute imports from "src"
    },
    "include": ["src/**/*", "global.d.ts", "vite.config.ts"], // Specifies files `TypeScript` should check
    "references": [{ "path": "./tsconfig.node.json" }] // Links to additional TypeScript configurations
}
```

Additionally, for Node.js and build tools, we have a separate tsconfig.node.json:

```json
{
    "compilerOptions": {
        "composite": true, // Enables project references for faster builds
        "module": "ESNext",
        "moduleResolution": "Node",
        "allowSyntheticDefaultImports": true
    },
    "include": ["vite.config.ts"]
}
```

#### Understanding include and references

**\-** **include**: This tells TypeScript which files to type-check. Here, we specify:

*   "src/\*\*/\*" - The entire source folder.
*   "global.d.ts" - A global type definition file (discussed later in the article).
*   "vite.config.ts" - Our Vite configuration, since it's TypeScript-based.

If a file isn't included, `TypeScript` won't check it, so defining this ensures all necessary files are type-checked.

**\-** **references**: This links additional tsconfig files for modularization. Here, we reference tsconfig.node.json, which configures `TypeScript` separately for build tools and prevents unnecessary type-checking in the main codebase.

#### Key Differences in JSX Configuration

**\-** **jsx: "react"** - Used for React versions before 17, requiring `import` React from 'react' in every component.

**\-** **jsx: "react-jsx"** - Introduced in React 17+, enabling automatic JSX runtime without explicit React imports.

If you're using `React` 17 or higher, update your config to "jsx": "react-jsx" for improved performance and a cleaner `import` structure.

#### Why separate config files?

The separation keeps our configuration clean and focused:  
\- tsconfig.json handles application code with strict type-checking  
\- tsconfig.node.json manages to build configurations with less strict rules  
\- This separation prevents build tools from interfering with application code rules

#### 2\. Global Type Declarations

Create a global.d.ts file at your project root:

```typescript
// Extend existing modules 
declare module 'react-intl' {
 export function FormattedMessage(props: any): JSX.Element;
}
```

This file serves multiple purposes:  
\- Declares types for imported assets  
\- Extends third-party module declarations  
\- Defines global interfaces and types  
\- Provides type safety for global variables

In my case, I used it to manually declare types for a library (react-intl) due to issues with its type definitions in the version I was using. Updating the package to fix the issue would have taken extra time, so the quickest solution was to declare the module inside global.d.ts. This approach is useful when a third-party library is missing types or has outdated definitions.

#### 3\. ESLint Configuration

To ensure a smooth transition from `JavaScript` to `TypeScript`, we updated .eslintrc. This configuration enforces strict type-checking for `TypeScript` while allowing some flexibility for `JavaScript` files.

#### 3.1 Create a base config file, mine is .eslintrc-custom-rules.json:

```json
{
  "rules": {
        // TypeScript-specific rules
        "@typescript-eslint/no-unused-vars": "warn", // Warns about unused variables
        "@typescript-eslint/explicit-module-boundary-types": "off", // Disables forced return types
        // More TypeScript rules

         "react/jsx-filename-extension": [
            1,
            {
                "extensions": [".js", ".jsx", ".ts", ".tsx"]
            }
        ],
        // Your existing JS/React rules ...
           
    },
}
```

then

```json
{
    "env": {
        "browser": true,
        "es2021": true,
        "node": true
    },
    "parser": `@typescript-eslint/parser`, // Use `typescript-eslint` parser 
    "parserOptions": {
        "project": "./tsconfig.json", // Ensures `ESLint` understands `TypeScript`'s config
        "ecmaFeatures": {
            "jsx": true // Enables `JSX` support
        },
        "ecmaVersion": 12,
        "sourceType": "module"
    },
    "extends": [
        "eslint:recommended", // Basic JS best practices
        "plugin:react/recommended", // `React`-specific linting rules
        "plugin:react-hooks/recommended", // Enforces proper `React` Hooks usage
        "plugin:promise/recommended", // Helps avoid common async/promise issues
        "plugin:@typescript-eslint/recommended" // `TypeScript`-specific rules
    ],
    "plugins": ["`react`", "`react-hooks`", "`@typescript-eslint`"],
    "settings": {
        "react": {
            "version": "detect" // Automatically detects `React` version
        }
    },
    "overrides": [
        {
            "files": ["*.js", "*.jsx"],
             "extends": ["./.eslintrc-custom-rules.json"], // Apply custom rules            
             "parserOptions": {              
               "project": null // Disables `TypeScript`-specific checks for `JS` files
            },
            "rules": {
                "@typescript-eslint/no-unused-vars": "off",
                "@typescript-eslint/explicit-module-boundary-types": "off",
                "@typescript-eslint/no-var-requires": "off", // Allows CommonJS require
                "@typescript-eslint/no-empty-function": "off" // Avoids unnecessary errors for empty functions
            }
        },
        {
            "files": ["vite.config.ts", "*.types.ts"],
            "extends": ["./.eslintrc-custom-rules.json"], // Apply custom rules
            "extends": ["eslint:recommended"],
            "rules": {
                "no-unused-vars": "off" // Avoids unnecessary warnings in config/type files
            }
        },
        {
            "files": ["*.ts", "*.tsx"],
            "extends": ["./.eslintrc-custom-rules.json"], // Apply custom rules
            "extends": ["eslint:recommended"],
            "rules": {
                "@typescript-eslint/no-explicit-any": "error", // Prevents use of 'any' type
                "@typescript-eslint/no-unsafe-argument": "error", // Ensures type safety in function arguments
                "@typescript-eslint/no-unsafe-assignment": "error", // Blocks unsafe assignments
                "@typescript-eslint/no-unsafe-call": "error", // Prevents calling values with unknown types
                "@typescript-eslint/no-unsafe-member-access": "error", // Restricts unsafe property access
                "@typescript-eslint/no-unsafe-return": "error", // Ensures return values are type-safe
                "@typescript-eslint/no-unsafe-function-type": "error", // Ensures function types are safe and properly typed.
                "@typescript-eslint/use-unknown-in-catch-callback-variable": "error" // Enforces using unknown type in catch callback variables for better error handling.
            }
        }
    ]
}
```

The configuration provides:  
\- Different rules for .js/.jsx and .ts/.tsx files  
\- Strict type checking for TypeScript files  
\- Relaxed rules for JavaScript files during migration

#### 4\. Vite Configuration

Transform your `vite.config.js` to `vite.config.ts`:

```typescript
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [
        react({
            include: /\.(jsx|tsx)$/, // Ensure .tsx files are processed correctly
        }),
        // Add your project-specific plugins here
    ],
    resolve: {
        extensions: ['.js', '.ts', '.jsx', '.tsx'], // Enable TypeScript file resolution
        // Add your project-specific resolve aliases here
    },
    // Other configurations...
});
```

#### Key Changes

*   `React` Plugin Update: The `react()` plugin now explicitly includes .tsx files to ensure `Vite` processes them correctly.
*   **Extensions Update**: Adding .ts and .tsx to resolve.extensions allows importing TypeScript files without specifying their extensions, making imports cleaner.

> **Note:** Ensure "moduleResolution": "Node" is set in your tsconfig.json. Without it, `TypeScript` might fail to resolve some `Vite` plugins correctly.

### Step 2: Starting with Shared Utilities

When beginning the TypeScript migration, start with your shared utilities. Look for code that is:  
1\. Frequently used across the application  
2\. Has well-defined inputs and outputs  
3\. Critical for application stability  
4\. Has minimal external dependencies

Common candidates include:  
\- API request wrappers  
\- Date/time formatters  
\- State management helpers  
\- Authentication utilities  
\- Validation functions

#### Organization Strategy

Structure your utilities with a clear separation of concerns:

```
shared/
├── utils/
│ ├── apiClient/
│ │ ├── types.ts
│ │ └── index.ts
│ └── validation/
│ ├── types.ts
│ │ └── index.ts
```

### Step 3: Establishing Patterns for Component Migration

After your utilities are converted, move on to components:

1\. **Start with Leaf Components**: Begin with components that have few or no dependencies.  
2\. **Create Interface Files**: Keep type definitions separate from component logic.  
3\. **Use Partial Types**: During migration, use Partial<T> for gradual typing.

### Best Practices Learned

1\. **Separate Types from Implementation**  
 -- Create .types.ts files alongside implementation files  
 -- Makes types easier to maintain and `import`  
 -- Reduces cognitive load when reading implementation code

2\. **Progressive Strictness**  
 -- Start with basic TypeScript rules  
 -- Gradually enable stricter rules as the team becomes more comfortable  
 -- Use ESLint overrides to apply stricter rules to TypeScript files

3\. **Type Organization**  
 -- Group related types in shared type files  
 -- Use namespaces for feature-specific types  
 -- Export commonly used types from a central location

4\. **Migration Strategy**  
 -- Convert shared utilities first  
 -- Then tackle isolated components  
 -- Leave complex, interconnected features for last  
 -- Use // @ts-ignore sparingly during migration

### Common Challenges and Solutions

1\. **Legacy Code Integration**  
 -- Challenge: Existing code might not follow patterns that work well with TypeScript  
 -- Solution: Create adapter layers between typed and untyped code

2\. **Third-Party Libraries**  
 -- Challenge: Missing or outdated type definitions  
 -- Solution: Create custom type definitions or use declare module

3\. **Complex State Management**  
 -- Challenge: Typing complex Redux/Context structures  
 -- Solution: Break down the state into smaller, typed pieces

### Conclusion

Gradual TypeScript adoption allows teams to modernize their codebase while maintaining productivity. By starting with shared utilities and establishing clear patterns, you can successfully introduce `TypeScript` into any `React` application.

Remember:  
\- Take small, incremental steps  
\- Establish clear patterns early  
\- Focus on shared code first  
\- Keep types and implementation separate  
\- Gradually increase type strictness

A smooth `TypeScript` migration is all about consistency and smart prioritization -- focus on what brings the most value first.

*This post was originally published on [Medium](https://mazenemam19.medium.com/gradual-typescript-adoption-in-react-1bdb2b363722).*