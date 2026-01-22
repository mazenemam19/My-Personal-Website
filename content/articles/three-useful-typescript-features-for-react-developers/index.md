---
title: "Three Useful TypeScript Features For React Developers"
description: "As a React developer, you’re likely familiar with the benefits of using a statically-typed language like TypeScript. TypeScript offers a type system that helps catch errors early, making it easier to write more reliable code faster."
date: "2023-05-10"
banner:
  src: "./banner.png"
  alt: "Three Useful TypeScript Features For React Developers"
categories:
  - "react"
  - "reactjs"
  - "typescript"
  - "frontenddevelopment"
keywords:
  - "react"
  - "reactjs"
  - "typescript"
  - "frontenddevelopment"
source: "Medium"
externalLink: "https://medium.com/@mazenemam19/three-useful-typescript-features-for-react-developers-1a4e9a1a3185"
---

![](./banner.png)

As a React developer, you’re likely familiar with the benefits of using a statically-typed language like TypeScript. TypeScript offers a type system that helps catch errors early, making it easier to write more reliable code faster. In a React context, TypeScript can also provide additional benefits such as improved code maintainability and extensibility. If you’re new to TypeScript, it’s a superset of JavaScript that adds optional static types to your code. This means that you can catch errors before your code runs, which can save you time and improve the quality of your codebase.

Matt Pocock’s [React With Typescript](https://www.totaltypescript.com/tutorials/react-with-typescript) course is an excellent resource to learn about how TypeScript works with React. Here are three useful features that I learned from the course:

### 1. ComponentProps utility type:

A common pattern in React is to create a component that takes props as an argument. TypeScript provides a utility type called ComponentProps, which automatically extracts the props type from a given component. This saves you time and helps avoid errors when defining a component’s props.

```typescript
import React from 'react';

const MyComponent = ({ name, age }: { name: string; age: number}) => {
  return (
    <div>
      <p>{name}</p>
      <p>{age}</p>
    </div>
  );
};

type MyComponentProps = React.ComponentProps<typeof MyComponent>;

const App = () => {
  const props: MyComponentProps = {
    name: 'John',
    age: 26,
  };

  return <MyComponent {...props} />;
};
```

ComponentProps proves more useful when used with rest parameters and Native HTML Elements

```typescript
import React from 'react';

function CustomButton(props: React.ComponentProps<'button'>) {
  return <button {...props}>Click me!</button>;
}

function App() {
  return (
    <div>
      <CustomButton onClick={() => console.log('Button clicked!')} />
    </div>
  );
}
```

In this example, we’re using the ComponentProps utility type to define the props for a custom CustomButton component that extends the functionality of the native button element. By passing the onClick prop to CustomButton, we're able to handle the button click event and log a message to the console. The ...props syntax allows us to pass any additional props to the underlying button element, such as className or disabledand if we tried to pass an invalid prop to the CustomButton element, Typescript will throw an error.

### 2. Union Types:

Another useful TypeScript feature is the ability to use union types with useReducer. This allows you to define a state type that can have multiple variations. For example, you can specify the type of action and the exact payload key expected

```typescript
import { useReducer } from "react";

type State = { count: number };

type Action =
  | { type: "add"; add: number }
  | { type: "subtract"; subtract: number };

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case "add":
      return { count: state.count + action?.add };
    case "subtract":
      return { count: state.count - action?.subtract };
    default:
      throw new Error();
  }
};

export const Reducer = () => {
  const [state, dispatch] = useReducer(reducer, { count: 0 });

  function onAdd1() {
    dispatch({ type: "add", add: 1 });
  }

  function onAdd2() { 
    dispatch({ type: "add" }); // will give error because we didn't provide a payload (add) with a number value
  }
  function onSubtract1() { 
    dispatch({ type: "SUBTRACT", subtract: 1 }); // will give error because type doesn't match
  }

  function onSubtract2() { 
    dispatch({ type: "subtract", subtract: "123" }); // will give error because payload subtract must be a number
  }

  return (
    <>
      <h1>{state.count}</h1>
      <button onClick={onAdd1}>add</button>
      <button onClick={onAdd2}>add</button>
      <button onClick={onSubtract1}>subtract</button>
      <button onClick={onSubtract2}>subtract</button>
    </>
  );
};
```

### 3. Excess Properties & Explicit Typing:

Finally, TypeScript provides a way to strongly type the functions returned by useState. This helps ensure that you’re using the correct type when updating the state and provide better error handling.

When you use the useState hook in a React component with TypeScript, the type of the state is inferred based on the initial value you provide. However, when you update the state using setState, TypeScript does not perform excess property checking by default. This means that you can add additional properties to the object you pass to setState, even if they are not part of the type of the state.

Consider the code below:

```typescript
import { useState } from "react";

interface TagState {
  tagSelected: number | null;
  tags: { id: number; value: string }[];
}

export const Tags = () => {
  const [state, setState] = useState<TagState>({
    tags: [],
    tagSelected: null,
  });
  return (
    <div>
      {state.tags.map((tag) => {
        return (
          <button
            key={tag.id}
            onClick={() => {
              setState((currentState) => ({
                ...currentState,
                tagselected: tag.id,
              }));
            }}
          >
            {tag.value}
          </button>
        );
      })}
      <button
        onClick={() => {
          setState((currentState) => ({
            ...currentState,
            tags: [
              ...currentState.tags,
              {
                id: new Date().getTime(),
                value: "New",
                otherValue: "something",
              },
            ],
          }));
        }}
      >
        Add Tag
      </button>
    </div>
  );
};
```

In the example above, when the Add Tag button is clicked it adds a new tag to the tags array, with properties id, value, otherValue , if the user clicked on one of the tags, the tagselected will be the tag id, there are two issues with our code, can you spot them? we added otherValue to the tags array, this property didn’t exist in our original tags type, yet typescript didn’t spot the issue. the second issue is tagselected , our original TagState interface had a property called tagSelected camel-cased, typescript didn’t spot this issue as well.

To get an error for this bug we can use explicit typing:

```typescript
<button
      key={tag.id}
      onClick={() => {
        setState(
          (currentState): TagState => ({ //notice the change in this line
            ...currentState,
            tagselected: tag.id, // will get an error due to explicit typing
          })
        );
      }}
    >
      {tag.value}
    </button> 
```
```typescript
<button
    onClick={() => {
      setState(
        (currentState): TagState => ({ //notice the change in this line
          ...currentState,
          tags: [
            ...currentState.tags,
            {
              id: new Date().getTime(),
              value: "New",
              otherValue: "something", // will get an error due to explicit typing
            },
          ],
        })
      );
    }}
  >
    Add Tag
  </button>
```

With explicit typing in place, TypeScript will now catch the typo in tagselected and the extra property otherValue, and throw an error. By catching these errors early, we can avoid bugs and improve the reliability of our code.

To summarize, TypeScript offers several useful features for React developers, including:

1. The ComponentProps utility type, which automatically extracts the props type from a given component and helps avoid errors when defining a component’s props.
2. Union types, which allow you to define a state type that can have multiple variations and provide better error handling with useReducer.
3. Explicit typing with useState functions, which helps ensure that you’re using the correct type when updating the state and catches errors early.

By leveraging these features, you can improve your React codebase’s maintainability, extensibility, and robustness. So next time you’re working on a React project, consider using TypeScript to take your development to the next level.

*This post was originally published on [Medium](https://medium.com/@mazenemam19/three-useful-typescript-features-for-react-developers-1a4e9a1a3185).*
