---
title: "Sorting Table Columns"
description: "I’ve been working with tables a lot these past few weeks, one task I got today was to implement a feature to sort table columns for unsorted data coming from the backend, this is how I tackled the task"
date: "2022-03-12"
banner:
  src: "./images/banner.png"
  alt: "Sorting Table Columns"
categories:
  - "react"
  - "javascript"
  - "algorithms"
keywords:
  - "react"
  - "javascript"
  - "algorithms"
source: "Medium"
externalLink: "https://medium.com/@mazenemam19/sorting-table-columns-8078d6b84337"
---

I’ve been working with tables a lot these past few weeks, one task I got today was to implement a feature to sort table columns for unsorted data coming from the backend, this is how I tackled the task

```jsx
import { useEffect, useState } from 'react';

export function App() {

  const [Data, setData] = useState([]);
  const [TableHeaders, setTableHeaders] = useState([]);

  useEffect(() => {

    const fetchData = async () => {
      const response = await fetch('https://jsonplaceholder.typicode.com/todos');
      const json = await response.json();
      setData(json);
      setTableHeaders(Object.keys(json[0]));
    }

    fetchData();
  }, []);

  return (
    <table>
      <thead>
        <tr>
          {TableHeaders.map((Header, Index) => (
            <th scope='col' key={Index}>{Header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Data?.map((Row, RowIndex) => (
          <tr key={RowIndex}>
            {TableHeaders.map((Header, ColumnIndex) => (
              <td key={ColumnIndex}>{Row[Header]?.toString()}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

> NB: I’m using [jsonplaceholder](https://jsonplaceholder.typicode.com/) to mimic the API I’ll be using for fetching data

So here’s what happened so far, our return statement ran first, we draw the table, _Data_ and _TableHeaders_ are initially empty, so nothing is shown, then the _useEffect_ kicks in, we fetch our data, set the _Data_ state to the `JSON` variable resulted from the `API` call and then we set _TableHeaders_ to the keys of the first object in _JSON_

The result of _json[0]_ is

```json
{
    "userId": 1,
    "id": 1,
    "title": "delectus aut autem",
    "completed": false
}
```

_Object.keys(json[0])_ returns an array with the keys of an object so now our _TableHeaders_ look like this

```javascript
["userId", "id", "title", "completed"]
```

setting the _TableHeaders_ & _Data_ states triggers a rerender, we then redraw our table and this is how it’d look like.

![](./images/image-0.webp)

Next, Sorting the Columns.

```jsx
import { useEffect, useState } from 'react';

const HeadersSchema = [
  {
    name: 'userId',
    order: 88,
  },
  {
    name: 'id',
    order: 6,
  },
  {
    name: 'title',
    order: 2,
  },
  {
    name: 'completed',
    order: 9,
  },
];

export function App() {
  const [Data, setData] = useState([]);
  const [TableHeaders, setTableHeaders] = useState([]);


  useEffect(() => {

    const fetchData = async () => {
      const response = await fetch('https://jsonplaceholder.typicode.com/todos');
      const json = await response.json();
      const TableHeaders = [];

      Object.keys(json[0]).forEach(Key => {
        HeadersSchema.forEach(Header => {
          if (Header.name === Key) {
            TableHeaders[Header.order] = Key;
          }
        });
      });

      setTableHeaders(TableHeaders.filter(Header => Header));
      setData(json);
    };
    fetchData();
  }, []);

  return (
    <table>
      <thead>
        <tr>
          {TableHeaders.map((Header, Index) => (
            <th scope='col' key={Index}>{Header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Data?.map((Row, RowIndex) => (
          <tr key={RowIndex}>
            {TableHeaders.map((Header, ColumnIndex) => (
              <td key={ColumnIndex}>{Row[Header]?.toString()}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

I created an array called _HeadersSchema_ which I’ll use to enforce the new order on my headers and since our _tbody_ is drawn through the values in _TableHeaders_ there won’t be much work needed on that end.

In the _useEffect_, instead of just setting the keys from the first object as they are to the _TableHeaders_, I’ll loop over those keys and loop over the schema when the _name_ in my _schema_ objects matches the _Key_ from _Object.keys(json[0]),_ I’ll add that Key to a new variable I’ve created in line 32 (very poor naming on my end, should have picked a better name than _TableHeaders_ to avoid confusion😅) in that specific order I got in my schema.

At this point, _TableHeaders_ look like this

```javascript
[empty x 2, "title", empty x 3, "id", empty x 2, "completed",empty x 78, "userId"]
```

to remove those empty slots we’ll use the filter function, filter returns a new array that matches our callback function, and in the callback, we’ll return the truthy values only hence all the empty slots are undefined (falsy)

_TableHeaders_ now look like this

```javascript
["title", "id", "completed", "userId"]
```

![](./images/image-1.png)

and that’s it! we have sorted our columns successfully in the same order provided in the schema 🥳

Lastly, we’ll handle the edge case scenarios if the same order in our schema is duplicated or if an object in our schema has no order at all 🤔

```jsx
import { useEffect, useState } from 'react';

const HeadersSchema = [
  {
    name: 'userId',
    order: 2,
  },
  {
    name: 'id',
  },
  {
    name: 'title',
    order: 2,
  },
  {
    name: 'completed',
    order: 9,
  },
];

export function App() {
  const [Data, setData] = useState([]);
  const [TableHeaders, setTableHeaders] = useState([]);

  useEffect(() => {

    const fetchData = async () => {
      const response = await fetch('https://jsonplaceholder.typicode.com/todos');
      const json = await response.json();
      const TableHeaders = [];

      const HandlingHeaders = Num => {
        if (!TableHeaders[Num]) return Num;
        else return HandlingHeaders(Num + 1);
      };

      Object.keys(json[0]).forEach(Key => {
        HeadersSchema.forEach(Header => {
          if (Header.name === Key) {
            const HeaderOrder = HandlingHeaders(Header.order ? Header.order : 99);
            TableHeaders[HeaderOrder] = Key;
          }
        });
      });

      setTableHeaders(TableHeaders.filter(Header => Header));
      setData(json);
    };
    fetchData();
  }, []);

  return (
    <table>
      <thead>
        <tr>
          {TableHeaders.map((Header, Index) => (
            <th scope='col' key={Index}>
              {Header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Data?.map((Row, RowIndex) => (
          <tr key={RowIndex}>
            {TableHeaders.map((Header, ColumnIndex) => (
              <td key={ColumnIndex}>{Row[Header]?.toString()}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

Luckily, both cases aren’t tough to handle.

```javascript
const HeaderOrder = HandlingHeaders(Header.order ? Header.order : 99);
TableHeaders[HeaderOrder] = Key;
```

I’ve replaced the _Header.order_ from the second demo with the variable _HeaderOrder_.

_HandlingHeaders_ is a function that checks if there’s no value in the index passed in the _TableHeaders_ array … no value in that index? cool, return that number … value in that number? add 1 and check again.

In our case, both userId and title have order 2

```javascript
[empty x 2, "userId", .....]
```

userId will take that spot since it comes first in our schema, when it’s time for the title to be called, _HandlingHeaders_ will be called with the order of title (2) … oh no someone already filled that spot! recursion happens, calls _HandlingHeaders(3) and_ this time and our array will look like this

```javascript
[empty x 2, "userId", "title", ......]
```

and that’s how we’ll handle having two objects in our schema with the same order.

In case we didn’t receive an order at all in our schema, I handled it with a small condition before passing the values to _HandlingHeaders_

```javascript
const HeaderOrder = HandlingHeaders(Header.order ? Header.order : 99);
```

And that’s the two edge case scenarios!

The result will look like this:

![](./images/image-2.png)

Hope you found this post useful,

Feel free to leave a comment if you have any questions.

And you can find all the code from the demos here: [https://github.com/mazenemam19/React-SortingTableColumns](https://github.com/mazenemam19/React-SortingTableColumns)

*This post was originally published on [Medium](https://medium.com/@mazenemam19/sorting-table-columns-8078d6b84337).*

