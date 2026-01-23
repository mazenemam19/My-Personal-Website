---
title: "Automate the Boring Stuff: Work Impact Analysis"
description: "Automate the Boring Stuff: Work Impact Analysis..."
date: "2025-11-13"
banner:
  src: "./images/banner.jpg"
  alt: "Automate the Boring Stuff: Work Impact Analysis"
categories:
  - "productivity"
  - "automation"
keywords:
  - "productivity"
  - "automation"
source: "Medium"
externalLink: "https://mazenemam19.medium.com/automating-the-boring-stuff-work-impact-analysis-7b9427fa0f83?source=rss-17340371ff6------2"
---

I've always had a problem with tracking my work. Started out using Notion, manually logging every task on one set monthly like some kind of developer diary. Super boring, but honestly? I liked it. There's something satisfying about looking back at years of accumulated progress.

This year, I leveled up. I built automation to pull data from Jira and GitHub and push it straight into Notion. What used to eat up an entire day now runs itself. Big win, right?

Except it wasn't enough.

The real problem wasn't tracking. It was understanding whether any of it actually mattered. I'd look at my work and think "okay, but is this important?" Maybe it's the whole frontend stigma thing, maybe not. But it wasn't about what other devs thought. It was what I thought. Did my work actually move the needle? Or was I just shipping features into the void?

I needed validation. Something to tell me my work had real impact. Something to help me remember my achievements months later when performance review season rolls around. I needed to quantify this stuff, and that's hard even for humans to do well.

So after wrestling with Notion for a while, I realized it can't do what I need. Notion solves tracking. But understanding the meaning of your work? That needs actual comprehension. Best option: humans. Second best: an LLM.

### What I Actually Built

Super simple concept: feed my Git commits to Gemini, get back a performance review. No elaborate integrations, no dashboards.  
Just: Git history → AI → impact report.

But before diving into code, let me show you how to actually use this because that's way more useful than architecture talk.

### How to Run This Thing

Three environment variables, that's all you need:

```
REPO_PATH="/path/to/your/repo"
GIT_EMAIL="your.email@company.com"
GEMINI_API_KEY="your-api-key-here"
```

Pretty self-explanatory. Point it at your repo, tell it which commits are yours via email, drop in your [Google AI Studio API key](https://aistudio.google.com/app/api-keys). Done.

Want a different model? Add GEMINI\_MODEL=whatever to your .env. Otherwise it defaults to gemini-2.5-flash.

Now, setup:

```bash 
pnpm run init-data
```

Just spits out template files for profile.json. You need to crack it open and fill in the blanks in the template. Boring, I know, but the LLM needs to know your story to tell it back to you properly.

After setup, three commands:

```bash 
pnpm run collect --days=7        # Grab last week pnpm run collect --since=2025-11-01  # Everything since a date pnpm run analyze                 # Generate the report
```

The collect command supports two flags: --days for "last N days" or --since for "everything after this date." It dumps your commits into data/work.json, then analyze ships it off to Gemini and writes a Markdown report.

Alright, now the interesting part. What's this thing actually doing?

### Part 1: Mining Git for Gold

Everything starts with git-collector.js. It's basically a fancy wrapper around git log that parses the output into structured data.

The command looks like this:

```javascript
`const` args = [
  "-C", 
  repoPath,
  "log",
  "-z",
  `--author=${authorEmail}`,
  `--since=${sinceDate}`,
  "--format=%H%n%aI%n%s%n%b",
  "--numstat",
];
```

Breaking it down: filter by your email, start from a specific date, return hash/date/subject/body for each commit. The magic is --numstat, which gives you line-by-line change counts per file.

Raw output looks like:

```
abc123def456 2025-11-01T10:30:00Z Add user authentication flow Implemented JWT token validation and refresh logic 10      2       src/auth/jwt.js 5       0       src/middleware/auth.js
```

The parser chews through this and extracts everything useful:

*   Commit hash and timestamp
*   Subject and body text
*   Lines added/deleted per file
*   File types touched (js, css, json, whatever)
*   Whether it's a merge commit

Then comes the fun part: scoring. Since we can't send every commit to Gemini (token limits are real), we need to pick the most important ones.

```javascript
`const` scoreCommit = (commit) => {
  `const` added = Math.abs(commit.linesAdded || 0);
  `const` deleted = Math.abs(commit.linesDeleted || 0);
  `const` files = commit.filesChanged || 0;
  `const` churnScore = added + deleted;
  `const` fileWeight = files * 200;
  return churnScore + fileWeight;
};
```

Simple heuristic: bigger commits that touch more files get higher scores. Not perfect, but it's a decent proxy for "this probably mattered."

We sort by score and grab the top 20. That's what goes to the LLM.

Everything gets saved to data/work.json:

```json
{
  "collectedAt": "2025-11-13T12:00:00Z",
  "period": { "days": 7 },
  "commits": [ /* your enriched commits */ ],
  "summary": {
    "totalCommits": 47,
    "totalLinesAdded": 3420,
    "totalLinesDeleted": 1205,
    "totalLinesChanged": 4625,
    "filesChanged": 89
  }
}
```

### Part 2: Context Is Everything

Here's where it gets interesting. You don't just throw raw Git data at an LLM and hope for magic. You need context. Who are you? What's your role? What are you trying to accomplish?

That's what profile.json is for. After running init-data, fill it out with:

*   Your role
*   Years of experience
*   Main tech stack
*   Current projects and your role in them
*   Career goals and what you're trying to prove

It looks like this:

```json
{
  "role": "Frontend Developer",
  "experience": "4 years",
  "focus": "React, TypeScript, Frontend Architecture",
  "projects": [
    {
      "name": "E-commerce Platform",
      "description": "Consumer shopping app",
      "yourRole": "Lead frontend for checkout flow"
    }
  ],
  "currentGoals": [
    {
      "goal": "Improve codebase maintainability",
      "why": "Tech debt is killing velocity",
      "metrics": ["Code review speed", "Bug reports"]
    }
  ]
}
```

Why does this matter so much? Because without context, the LLM can only tell you what you did. "You changed 500 lines in these files." Cool, so what?

With context, it explains why it matters. "You refactored the checkout flow to reduce tech debt, aligning with your goal of improving maintainability and directly impacting team velocity."

Same commits, completely different story.

### Part 3: Crafting the Prompt

The prompts.js file is where everything comes together. It takes your profile plus your Git data and builds a massive prompt for Gemini.

First, it dumps your entire developer profile. Then it adds your work summary:

```
## Work Snapshot
- Period: Last 7 days
- Total Commits: 47
- Lines Added: 3,420
- Lines Deleted: 1,205
- Files Touched: 89
- Average Lines per Commit: 98
```

Then it lists those top 20 commits in detail:

```
### 1. Refactor authentication middleware
- Hash: abc123def456
- Date: 2025-11-01
- Lines: +150 / -45
- Files Changed: 3
- File Types: js, json

Extracted JWT validation logic into reusable middleware.
Reduced duplication across protected routes...
```

After all that setup, the prompt gives Gemini very specific instructions: "You're an experienced engineering manager. Use ONLY the evidence provided. Don't invent ticket numbers or metrics. Base everything on observable data."

Then it asks for a structured analysis with sections like:

*   Executive Summary
*   Key Achievements
*   Delivery Patterns
*   Skills Demonstrated
*   Growth Indicators
*   Performance Review Talking Points
*   "Should I Feel Proud?" Assessment
*   Emotional Validation
*   Opportunities & Next Steps
*   CV Highlights (6 resume bullets)

The CV section is particularly important. It explicitly says:

> Generate 6 resume bullets for a senior engineer. Make them sound like high-level accomplishments, not task logs. Emphasize leadership and impact. Never mention line counts or commit numbers._

Because nobody wants a resume bullet that says "Made 47 commits this quarter." You want "Led frontend refactor that improved maintainability and reduced onboarding time for new engineers."

### Part 4: Calling Gemini

The gemini-client.js file handles the actual API call. Boring stuff like retry logic, exponential backoff, token limit detection. Necessary but not exciting.

One interesting bit: model name resolution. You can write GEMINI\_MODEL=gemini-2.5-pro in your .env, but if you didn't, scripts automatically fallback to gemini-2.5-flash. The client auto-fixes this.

It also tries to fetch max output tokens from a cached data/models.json file (you can generate this with pnpm run list-models). Falls back to 8,192 if that doesn't work.

Once everything's ready, it fires off the request and waits. Takes 30-60 seconds usually. The analyze.js script shows a progress counter so you don't think it froze.

When Gemini responds, you get one giant Markdown blob. Gets saved to reports/<timestamp>-impact.md.

### What You Actually Get

The final report reads like a real performance review. Here's an example section:

### Key Achievements

> **_1\. Authentication System Refactor_**_  
> Extracted JWT validation into reusable middleware across 8 files, eliminating duplication in protected routes. Shows strong architectural thinking and sets up the codebase for easier testing and maintenance._

> **_2\. Checkout Flow Optimization_**_  
> Reduced checkout component complexity by 40%, improving readability and lowering the barrier for other engineers to contribute. Directly aligns with your stated goal of improving maintainability._

It cites specific commits. Ties your work to your goals. Explains why things matter, not just what changed.

And the CV bullets look like:

> Architected reusable authentication middleware that standardized security patterns platform-wide, reducing onboarding friction and enabling faster feature development.

That's LinkedIn-ready. That's what you send to recruiters.

### Why Simple Is Enough

This is deliberately basic. You could add Jira ticket descriptions, GitHub PR comments, deployment metrics, Slack mentions, whatever. But I didn't need all that.

I do multiple commits per ticket and write detailed commit messages. I treat them like documentation. So the LLM gets enough context from the message alone without reading any code.

Good commit messages tell a story. They capture intent, scope, evolution. The LLM reads that story and shows it back to you in a way that's hard to see yourself.

### Why This Actually Matters

I didn't build this for fun or to learn prompt engineering. I built it because I needed to understand my own worth.

I need proof my work matters. Not for me (okay, partly for me). But for the conversations that affect my career:

**Performance reviews** where I justify my impact to my manager.  
**Salary negotiations** where I need concrete evidence of value delivered.  
**Job applications** where I translate Git commits into accomplishments hiring managers care about.

This tool gives me that ammunition. It turns "I worked really hard" into "I delivered X, which enabled Y, and positioned the team for Z."

When my manager asks what I've been working on, I don't scramble to remember. When a recruiter asks for my biggest achievement, I have bullets ready. When I negotiate salary, I have a document proving measurable impact.

That's what this is really about. Knowing my worth. Feeling my impact. Advocating for myself with confidence.

### Try It

Code's on [GitHub](https://github.com/mazenemam19/work-impact-analysis-demo). Clone it, fork it, customize it. Add Jira if you want. Add PR data if you need it. Or keep it simple like I did.

If you struggle to articulate your impact for reviews, negotiations, or job searches, give this a shot. Let an LLM be your mirror. Give it context, give it evidence, let it show you what you've built.

Because knowing your worth shouldn't be this hard.

*This post was originally published on [Medium](https://mazenemam19.medium.com/automating-the-boring-stuff-work-impact-analysis-7b9427fa0f83?source=rss-17340371ff6------2).*


