---
title: "My Unorthodox Frontend Interview"
description: "Last week I did my first technical interview at a medium-size tech company, most of the interviews I had so far were at small-size tech companies, It was interesting and different from other interviewing experiences I had before."
date: "2022-09-25"
banner:
  src: "./banner.png"
  alt: "My Unorthodox Frontend Interview"
categories:
  - "interviewquestions"
  - "interview"
  - "frontend"
keywords:
  - "interviewquestions"
  - "interview"
  - "frontend"
source: "Medium"
externalLink: "https://medium.com/@mazenemam19/my-unorthodox-frontend-interview-986cb934b9f5"
---

![](./banner.png)
_Picture from the Search Committee episode — The Office tv series_

Last week I did my first technical interview at a medium-size tech company, most of the interviews I had so far were at small-size tech companies, It was interesting and different from other interviewing experiences I had before.

### **Q: What is the difference between small and medium size company interviews?**

**A: The difference is in the type of questions and what the interviewer seeks to learn about you.**

Here is a comparison between applying to a React Developer role in those two different organizations.

In the small ones, you would typically be asked about programming languages and frameworks you will use in your daily life.   
For example: in my last interview in a small company I was asked about the difference between var, let, and const, some more Javascript questions, and a Javascript problem, I was also asked If I’ve used Typescript before, then we moved to the React, I was asked about Context API, React Router and Redux Toolkit.

In the medium ones, the interviewer is after something else, they want to know if you know the value of the code you are writing and its effect on the whole project.  
Example: I was asked about clean code, object-oriented programming (OOP), testing (unit testing — automated testing), website performance, tracking traffic, data structure, and the space and time complexity of an algorithm.

I was also asked some general frontend questions which I regret not answering perfectly :(

Hopefully, they will help you be more prepared for your next interview🤞

**Q1: What is the difference between cookies, local storage, and session storage?**

{% youtube GihQAC1I39Q %}

**Q2: What is the difference between HTTP and HTTPS?**

{% youtube nOmT_5hqgPk %}

**Q3: What is the difference between Put and Patch request methods?**

I didn’t know the answer to this one at all 😐 I’m still embarrassed about it.

{% youtube LJajkjI5RHE %}

**Q4: What are 3 ways you can use to optimize a page that loads 100 Images**  
- Pagination   
- Lazy loading  
- Intersection Observer API

I found [this article](https://medhatdawoud.net/blog/optimize-data-fetching) to be very insightful on optimization and performance.  
Have you heard of AbortController API before 👀 Check out [this article](https://svarden.se/post/debounced-fetch-with-abort-controller)!

**Q5: Find all the duplicates in an array and explain the time complexity of your algorithm**

At the time of the interview, I didn’t do well at this one, I gave an algorithm with O(n²) complexity🤦‍♂ but this incident taught me a lesson about the importance of learning algorithms.

On a regular day, I’d probably solve this problem with a code like this:

```javascript
function removeDuplicates(arr) {
   return arr.filter((item,index) => arr.indexOf(item) === index);
 }

```

If you are looking for a more efficient solution, you should check the video below, I tested both solutions on Leetcode and the one from the video was way faster than my solution.

{% youtube aMsSF1Il3IY %}

**Bonus: Do you know that** [**for loop is the fastest loop**](https://blog.bitsrc.io/measuring-performance-of-different-javascript-loop-types-c0e9b1d193ed)?

Hope you enjoyed this read and have refreshed your memory on some interview topics.

Ciao👋

*This post was originally published on [Medium](https://medium.com/@mazenemam19/my-unorthodox-frontend-interview-986cb934b9f5).*
