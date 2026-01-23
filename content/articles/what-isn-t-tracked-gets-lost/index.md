---
title: "What Isn’t Tracked Gets Lost"
description: "What Isn’t Tracked Gets Lost..."
date: "2025-12-21"
banner:
  src: "./banner.jpg"
  alt: "What Isn’t Tracked Gets Lost"
categories:
  - "front-end-development"
  - "react"
  - "web-development"
  - "javascript"
  - "typescript"
keywords:
  - "front-end-development"
  - "react"
  - "web-development"
  - "javascript"
  - "typescript"
source: "Medium"
externalLink: "https://javascript.plainenglish.io/what-isnt-tracked-gets-lost-b27abb36cff1?source=rss-17340371ff6------2"
---

I've realized that if I don't write down the specific "gotchas" and lightbulb moments I encounter during the daily grind, they just evaporate.

I switched jobs recently. Whenever you join a new codebase, you learn a mix of general tech improvements and domain-specific quirks. Over the last few months, I've been maintaining a list of things that tripped me up, things I improved, and things I just found cool.

### 1. The "I Was Doing `React` Query Wrong" Saga

I started using **`TanStack Query`** (formerly `React Query`) more heavily this year, and it's been a game changer. But, boy, did I make it harder than it needed to be at first.

#### The Config Object Mistake

For the first month, I created a `const queryConfig = { ... }` object and imported it into every `` `useQuery` `` hook to ensure consistent `staleTime` and `refetchOnWindowFocus` settings.

Turns out, I was reinventing the wheel. You can just set global defaults when initializing the `QueryClient`. Felt pretty silly deleting those imports.

```javascript
// Do this once in your App entry point
const queryClient = new `QueryClient`({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
})
```

📌 [Documentation](https://tanstack.com/query/v5/docs/framework/react/guides/default-query-function)

#### Global Error Handling with meta

We needed a way to show toast notifications for `API` errors without having to write `onError: (err) => toast.error(err.message)` in every component.

I found a discussion on GitHub about using the `meta` field to pass arbitrary data. Now, we handle errors globally in the QueryCache callback, but the actual message is controlled locally.

```javascript
// In the component
`useQuery`({
  queryKey: ['todos'],
  queryFn: fetchTodos,
  meta: {
    errorMessage: 'Failed to load the todo list. Try again later.'
  }
})
```

```javascript
// In the QueryClient global config
new QueryClient({
  queryCache: new `QueryCache`({
    onError: (error, query) => {
      if (query.meta?.errorMessage) {
        toast.error(query.meta.errorMessage)
      }
    }
  })
})
```

📌 [Query Functions Context](https://tanstack.com/query/v5/docs/framework/react/guides/query-functions#queryfunctioncontext)  
📌 [TypeScript Meta](https://tanstack.com/query/latest/docs/framework/react/typescript#registering-global-meta)

### 2. The Auth Loop: 401 vs. 403

This was a system-wide headache. Our backend was throwing a **401 Unauthorized** error for every scenario, whether the token was missing, invalid, or expired.

The problem: If a token expired, the app would assume the user was a stranger and immediately redirect them to the login screen.

#### The Fix

We sat down with the backend team to strictly define the error codes:

*   **401**: "Who are you?" (Missing or invalid credentials) → **Logout / Redirect to Login**
*   **403**: "I know who you are, but you can't do this" (Token expired) → **Attempt Refresh Token flow**

Now, when we catch a 403, we silently refresh the token and retry the request without interrupting the user.

📌 [StackOverflow Discussion](https://stackoverflow.com/a/6937030)

### 3. Internationalization (`i18next`) Gotchas

I owe the codebase an apology for how I handled translations in the beginning. Let's break down a few mistakes I made:

#### The `t` Function

We were importing the `t` function directly from the `i18next` instance in non react component. The issue? It doesn't respond to language changes.

**Fix**: Use the pre-initialized i18next instance or use ``const { t } = useTranslation()`. This ensures the component re-renders when the language changes.

📌 [GitHub Issue](https://github.com/i18next/react-i18next/issues/1236#issuecomment-762039023)  
📌 [T outside React](https://www.locize.com/blog/how-to-use-i18next-t-outside-react-components)

#### Plurals & The `` `<Trans>` `` Component

I used custom logic to handle singular/plural strings. Don't do that. `i18next` can handle it automatically if you name your keys properly (`key`, `key_one`, `key_other`).

Also, if you need to bold a word inside a translation string or add a link, use the `` `<Trans>` `` component rather than chopping the string into pieces. It lets you interpolate React components right into the translation string.

📌 [Plurals Documentation](https://www.i18next.com/translation-function/plurals#singular-plural)  
📌 [Trans Component](https://react.i18next.com/latest/trans-component#alternative-usage-which-lists-the-components-v11.6.0)

### 4. WebSockets: The Cleanup Crew

First time working with **`WebSockets`** (we used `STOMP`), and it worked great until I logged out and logged in again, only to see error with socket connection flashing on the screen.

#### The Lesson: Cleanup is Critical

When a user logs out:

1. Disconnect STOMP cleanly: `` `client.disconnect()` ``
2.  Close the WebSocket connection.
3. Clear any relevant storage (e.g., `JWT`).

When the user logs back in, initialize a fresh connection. This ensures the socket handshake uses the new `JWT`. Reusing the old socket instance can leave you with expired or invalid credentials.

### 5. API Typing & Caching

#### Typing

Here's a small but impactful TypeScript lesson with **`axios`** (or fetch wrappers):

**Bad:**

```javascript
const response = await api.get('/users'); // response is `any`
```

**Good:**

```javascript
const response = api.get<User[]>('/users'); // response is typed correctly
```

By typing the HTTP verb itself, `TypeScript` knows exactly what data you're dealing with, saving you from having to cast it later on.

#### Caching

Caching everything is tempting, but it's not always the best idea. Caching is "expensive" in terms of memory and complexity (invalidation is tough).

*   **Worth it**: Large datasets that rarely change (e.g., country lists, currencies).
*   **Not worth it**: Small, frequently changing data that needs to stay up-to-date.

### 6. `React Router`: navigate(-1)

Small tip: If you want a "Back" button, use `` `navigate(-1)` `` to pop the history stack, similar to hitting the browser back button.

Use specific routes (`` `navigate('/previous-route')` ``) when you need to take the user to a particular place after an action.

Another tip: Don't write your paths as strings everywhere, you can easily make a typo, a solution I adopted in our codebase was to create a constant and use it all over the app when I need to define routes:

```javascript
export const `APP_ROUTES` = {
  base: "/discover",
  cards: {
    base: "/discover/cards",
    cardRoute: "/discover/cards/:clusterId",
    card: (clusterId) => `/discover/cards/${clusterId}`,
  },
} as const
```

📌 [useNavigate Documentation](https://reactrouter.com/api/hooks/useNavigate)

### 7. Husky:

We added **`Husky`** for pre-commit hooks (linting/formatting), and it worked fine for me. Then, my colleague pulled the code, and it failed.

#### The Gotcha:

The `` `.husky/pre-commit` `` file needs to be executable. If it isn't, Husky won't trigger on commit.

```bash
chmod +x .husky/pre-commit
```

📌 [Husky Issues](https://github.com/typicode/husky/issues/1241)

### 8. Working With Project Managers

In my experience, a manager doesn't need to be deeply technical to be great at their job. Their strength is in understanding user needs, business goals, and prioritization. But when a PM isn't technically knowledgeable, they can genuinely believe there's only one "right" way to solve a problem, often based on intuition rather than engineering trade-offs.

It's tempting as a developer to push back with, "That won't work" or "That's wrong." But simply stating why something is problematic doesn't help anyone. Good collaboration means framing objections with alternatives and explanations that connect to outcomes rather than just implementation.

For example:

> Instead of saying, "This design will be slow," say something like, "This approach has performance implications under load, if we do **X** instead, we keep a similar user experience with significantly better performance and lower maintenance cost."

Your job isn't to be a gatekeeper of "correct implementation", it's to translate technical constraints into business value and propose options that achieve the PM's goals with fewer trade-offs.

When you present problems and solutions, you enable better decision-making and build trust between product and engineering.

That's all for now! If you found any of these lessons helpful, feel free to share.

*This post was originally published on [Medium](https://javascript.plainenglish.io/what-isnt-tracked-gets-lost-b27abb36cff1?source=rss-17340371ff6------2).*
