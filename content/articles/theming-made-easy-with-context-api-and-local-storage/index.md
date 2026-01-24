---
title: "Theming Made Easy… With `Context API` And `Local Storage`"
description: "One thing I always wanted to implement in al projects was theming but I never learned how until very recently and it's quite easy."
date: "2021-11-19"
banner:
  src: "./banner.webp"
  alt: "Theming Made Easy… With Context API And Local Storage"
categories:
  - "react"
  - "context-api"
  - "css"
  - "react-hooks"
keywords:
  - "react"
  - "context-api"
  - "css"
  - "react-hooks"
source: "Medium"
externalLink: "https://mazenemam19.medium.com/theming-made-easy-with-context-api-and-local-storage-a0f8fc634ae8"
---

_Photo by Koala on Unsplash_

One thing I always wanted to implement in all projects was theming but I never learned how until very recently and it's quite easy. In this post I'll walk you through it step by step, the only prerequisite is some basic `react` knowledge.

let's start by creating a new `React` app

```bash
npx create-react-app theming
```

and downloading `bootstrap`

```bash
cd theming
npm i bootstrap
```

importing bootstrap in the `index.js` and clearing default styles in our `index.css`

```javascript
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import 'bootstrap/dist/css/bootstrap.min.css';
```

Next, let's move to our `App.js`, we will return a simple component that shows hello world in the center of the screen and apply our coloring through `CSS` variables

```javascript
// App.js
import React from 'react';
import './index.css';

function App() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <h1>Hello World</h1>
    </div>
  );
}

export default App;
```

```css
/* index.css */
:root {
  --text-color: #000;
  --background-color: #fff;
}

body {
  color: var(--text-color);
  background-color: var(--background-color);
}
```

Next, we create our themes and store, our theme will be a simple object with a name and color keys, I'll put it in an assets folder in the src directory, and the themes file will look like this

```javascript
// src/assets/themes.js
export const themes = [
  {
    name: 'light',
    textColor: '#000',
    backgroundColor: '#fff',
  },
  {
    name: 'dark',
    textColor: '#fff',
    backgroundColor: '#333',
  },
];
```

Next, we'll create our store, I'll put the store in a new context folder in the src directory, the store will have a state variable to hold into our current theme and a function to change our theme, then we'll provide our store to the app

```javascript
// src/context/ThemeContext.js
import React, { createContext, useState } from 'react';
import { themes } from '../assets/themes';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [selectedTheme, setSelectedTheme] = useState(themes[0]);

  const changeTheme = (theme) => {
    setSelectedTheme(theme);
  };

  return (
    <ThemeContext.Provider value={{ selectedTheme, themes, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
```

Next is consuming that selectedTheme we got from our context store, but I want to create a navbar first so I can change my theme with changeTheme I'll add a new components folder in the src directory which will hold our Navbar.
I'll use the default `bootstrap` navbar and edit it so I'll only have the dropdown on the right side instead of the default form, I'll also add some CSS to make it override the look of the default dropdown and provide my var( - text-color) to the navbar

```javascript
// src/components/Navbar.js
import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

const Navbar = () => {
  const { themes, changeTheme } = useContext(ThemeContext);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">Theming App</a>
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Themes
              </a>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                {themes.map((theme) => (
                  <li key={theme.name}>
                    <button className="dropdown-item" onClick={() => changeTheme(theme)}>
                      {theme.name}
                    </button>
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
```

Indentation screwed me a little here 😅 Our navbar expects to get selectedTheme , themes and changeTheme (to change the value in the context state)as props so let's provide them with our navbar and provide the navbar to our `App` component

```javascript
// App.js
import React, { useContext, useEffect } from 'react';
import './index.css';
import { ThemeContext, ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';

function App() {
  const { selectedTheme, changeTheme } = useContext(ThemeContext);

  useEffect(() => {
    document.documentElement.style.setProperty('--text-color', selectedTheme.textColor);
    document.documentElement.style.setProperty('--background-color', selectedTheme.backgroundColor);
  }, [selectedTheme]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
      <Navbar />
      <h1>Hello World</h1>
    </div>
  );
}

export default App;
```

Lastly, the logic to apply the theming

```javascript
// App.js - updated with local storage logic
import React, { useContext, useEffect, useState } from 'react';
import './index.css';
import { ThemeContext, ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import { themes } from './assets/themes';

function App() {
  const { selectedTheme, changeTheme } = useContext(ThemeContext);
  const [isFirstRun, setIsFirstRun] = useState(true);

  useEffect(() => {
    if (isFirstRun) {
      const storedThemeName = localStorage.getItem('theme');
      const storedTheme = themes.find(t => t.name === storedThemeName);
      if (storedTheme) {
        changeTheme(storedTheme);
      }
      setIsFirstRun(false);
    }

    document.documentElement.style.setProperty('--text-color', selectedTheme.textColor);
    document.documentElement.style.setProperty('--background-color', selectedTheme.backgroundColor);
    localStorage.setItem('theme', selectedTheme.name);
  }, [selectedTheme, isFirstRun, changeTheme]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
      <Navbar />
      <h1>Hello World</h1>
    </div>
  );
}

export default App;
```

Here's what those extra lines of code did:

First I added a boolean and called it isFirstRun to check if this is the first time our component is rendered to the user, the `useEffect` will be executed after our component renders on the screen.
I get a value stored on the `localStorage` (typically you won't have this value if this is your first time using the app) and I find the last theme the user had based on it.

So if you had used this app before and this is the first time the component renders on your screen, I change isFirstRun to false, I change the default theme I get from the context with the last theme the user lastly had, and I override the value of my var( - text-color) with the color from my storedTheme else which runs whenever the user changes the theme, I'll change the var( - text-color) with the new color I'm getting from the context and save that object's name to the `local storage`. this way on the next run of this app, they'll have that last theme they had previously.

Hope you find this tutorial useful, please feel free to leave a comment if you had any questions.
You can find a repo with all the code from this tutorial here: https://github.com/mazenemam19/Themeing-With-Context-Api

And you see a live version here:
https://cranky-sammet-29f6ab.netlify.app/

Ciao 👋

*This post was originally published on [Medium](https://mazenemam19.medium.com/theming-made-easy-with-context-api-and-local-storage-a0f8fc634ae8).*