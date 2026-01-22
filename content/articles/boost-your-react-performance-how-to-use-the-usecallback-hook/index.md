---
title: "Boost Your React Performance: How to Use the useCallback Hook"
description: "Boost Your React Performance: How to Use the useCallback Hook..."
date: "2023-07-07"
banner:
  src: "./banner.jpg"
  alt: "Boost Your React Performance: How to Use the useCallback Hook"
categories:
  - "javascript-tips"
  - "frontend-development"
  - "web-performance"
  - "react"
  - "javascript"
keywords:
  - "javascript-tips"
  - "frontend-development"
  - "web-performance"
  - "react"
  - "javascript"
source: "Medium"
externalLink: "https://mazenemam19.medium.com/boost-your-react-performance-how-to-use-the-usecallback-hook-5b56b948b4ac?source=rss-17340371ff6------2"
---

As React developers, we're always looking for ways to optimize the performance of our applications. One way to achieve this is by using the useCallback hook.

The useCallback hook is a built-in React hook that allows us to memoize a function, meaning that it will only be re-created if one of its dependencies changes. This can be especially useful when passing functions down to child components, as it can prevent unnecessary re-renders.

### Identifying Functions to Memoize

So which functions are good candidates for optimization with useCallback? Generally speaking, any function that is passed down to a child component as a prop can benefit from being memoized with useCallback. This includes event handlers, callback functions, and other functions that are used as props.

To identify which functions can be memoized, look for functions that are created inside the component's render method or inside other functions that are called on each render. These functions will be re-created on each render, which can be costly if they're passed down to child components and cause unnecessary re-renders.

For example, consider the following functional component:

```html function MyComponent({ onClick }) {
 `const` handleClick = () => {
  onClick();
 };

return (
 <button onClick={handleClick}>Click me</button>
 );
}
```

In this component, the handleClick function is created inside the component's function body and is called on every render when the button is clicked. If MyComponent is re-rendered for any reason, such as when its props change or its state is updated, handleClick will be recreated and the button will be re-rendered, even though its behavior hasn't changed. This can cause unnecessary re-renders and affect the performance of the application.

By using the useCallback hook to memoize handleClick, we can avoid this problem:

```html function MyComponent({ onClick }) {
 `const` handleClick = useCallback(() => {
  onClick();
 }, [onClick]);

return (
 <button onClick={handleClick}>Click me</button>
 );
}
```

In this updated version of MyComponent, handleClick is memoized using useCallbackand the onClick prop is included in its dependency array. This means that \`handleClick\` will only be re-created if onClick changes, which helps to avoid unnecessary re-renders.

### Understanding Shallow Copying

When using useCallback, it's important to understand how React determines whether a dependency has changed. React uses shallow copying to check for changes in the values of the dependency array.

> Shallow copying means that only the top-level reference of an object or an array is checked, not the contents of the object or array. This means that if the contents of an object or array change, but the reference remains the same, React won't detect the change and the memoized function won't be re-created.

Here's an example to illustrate shallow copying:

![](https://cdn-images-1.medium.com/max/1024/0*8lcB-tRxunpX6UvF.jpg)

[https://cseducators.stackexchange.com/a/811](https://cseducators.stackexchange.com/a/811)

and here is a better illustration with some code 😅

```html
`import` React, { `useState`, useCallback } from 'react';

function App() {
  `const` [count, setCount] = `useState(0)`;
  `const` [person, setPerson] = `useState({` name: 'John', age: 20 });

  `const` incrementCount = useCallback(() => {
    setCount(count + 1);
  }, [count]);

  `const` updatePerson = useCallback(() => {
    person.age += 1;
    setPerson(person);
  }, [person]);

  console.log('Render App');

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={incrementCount}>Increment Count</button>
      <p>Person: {person.name}, {person.age}</p>
      <button onClick={updatePerson}>Update Person</button>
    </div>
  );
}

`export` default App;
```

In the above example, we have two useCallback functions, incrementCount and updatePerson. Both of these functions have dependencies defined in their second argument, which is an array of values that the function depends on.

incrementCount depends on the count state and is created with the dependency array \[count\]. This means that the function will be memoized and only re-created when the value of count changes.

updatePerson depends on the person state and is created with the dependency array \[person\]. However, in the function body, we are modifying the age property of the person object, but not creating a new object reference. This means that although the contents of the person object have changed, the reference remains the same, and React won't detect the change. This causes the updatePerson function to not be re-created, and subsequent calls to it will have the old person object reference with the updated age property.

To fix this issue, we need to create a new object reference with the updated age property whenever we update the person state. We can do this by using the spread operator to create a shallow copy of the person object:

```javascript
`const` updatePerson = useCallback(() => {
  setPerson({ ...person, age: person.age + 1 });
}, [person]);
```

This creates a new object with all the properties of the old person object, but with the age property updated. Now, when we call the updatePerson function, React will detect the change in the person object reference and re-create the function.

<a href="https://medium.com/media/da890325b5f55b1b3de353253c636849/href">https://medium.com/media/da890325b5f55b1b3de353253c636849/href</a>

### Conclusion

The useCallback hook is a powerful tool for optimizing React performance by memoizing functions and preventing unnecessary re-renders. However, in the hands of inexperienced developers, the useCallback hook could be misused, leading to performance issues and unexpected behavior. Therefore, it's important to use it responsibly and to ensure that the dependencies are updated correctly.

Additionally, it's crucial to prioritize code readability and maintainability to ensure that the application remains easily understandable and maintainable in the long run. By striking a balance between performance and readability, we can create React applications that are efficient, maintainable, and easy to understand.

So the next time you're passing functions down to child components, consider using the useCallback hook to optimize your React application. Your users (and your CPU) will thank you!

*This post was originally published on [Medium](https://mazenemam19.medium.com/boost-your-react-performance-how-to-use-the-usecallback-hook-5b56b948b4ac?source=rss-17340371ff6------2).*
