---
title: "The Truth Table in `React`"
description: "One of the first topics you learn about when you get introduced to programming is “The Truth Table”, Do you remember that topic?"
date: "2022-01-19"
banner:
  src: "./banner.png"
  alt: "The Truth Table in `React`"
categories:
  - "react"
  - "javascript"
  - "fundamentals"
keywords:
  - "react"
  - "javascript"
  - "fundamentals"
source: "Medium"
externalLink: "https://medium.com/@mazenemam19/the-truth-table-in-react-a43f665a0cd3"
---

One of the first topics you learn about when you get introduced to programming is “The Truth Table”, Do you remember that topic?  
In case you don’t, here’s a reminder:

| A | B | A && B | A \|\| B |
|---|---|---|---|
| true | true | true | true |
| true | false | false | true |
| false | true | false | true |
| false | false | false | false |

I remember memorizing that table, I kept repeating it day and night, but I never had any real application for it (or so I thought…)

Today I realized that I’ve been using it all the time but I never knew 🤯

The most common use case is showing/hiding a `component` based on conditions with the && operator

```javascript
true && <Component/> {/* will render the component*/}

false && <Component/> {/* will hide the component*/}
```

Does this code block look familiar?  
It’s !!

Actually, these conditions resolve to

```javascript
true && true => true 

false && true => false 
```

Which is the result expected if you know the truth table

Another use-case is using the || operator to assign a default value

[Code](https://gist.github.com/mazenemam19/725d911e7403c851ff5d42e5efe04175)


Ignoring that we could set the initial state to [] instead of null , using the || operator could come in handy.

In this example, we pass a `prop` called data to the Blog component, `posts` have a falsy initial value (`null` ) and the empty array is a truthy value

```javascript
data={false || []} {/* sends the empty array to Blog component */}
```

so that expression will resolve to

```javascript
false || true => true
```

After the `API` call resolves successfully and our posts become populated, posts become truthy

```javascript
true || true => true
```

But which true value is sent

> || behaviour is to return the first truthy value, opposite to && which returns last truthy value

and since our posts are truthy now

```javascript
data={true || []} {/* sends posts array to Blog component*/}
```

Hope you found this post useful,

If you know of any other use cases, feel free to share them in the comment section.

Ciao👋

*This post was originally published on [Medium](https://medium.com/@mazenemam19/the-truth-table-in-react-a43f665a0cd3).*