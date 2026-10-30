---
title: AI Can Cook. Can It Run the Restaurant?
description: Code is cheap now. So what are developers really paid for? A friendly guide to new roles, real user value and avoiding AI slop.
date: 2026-10-30
tags:
  - ai
  - software-development
  - career
  - developer-career
  - product-development
  - ai-slop
  - saas
lang: en
draft: false
---

# AI Can Cook. Can It Run the Restaurant?


*What developers are really paid for when code becomes cheap*


A few years ago, writing code was the hard part. Today you can type one sentence and get 500 lines back in ten seconds. So a fair question is: if the robot writes the code, what are we doing here?


Here is my short answer: **writing code got cheap. Understanding, checking and owning it did not.**


Think about a coffee shop. You buy a new machine that makes coffee ten times faster. Great! But the line is still long, because the cashier is slow, the milk runs out and nobody knows how to fix the card reader. A faster machine does not fix a slow shop. Software is the same. AI made one step (typing code) much faster, but that step was never the only problem. Understanding what people need, designing it well, checking it and keeping it running are still slow. That is where our value moves.


And one more thing: free code is like a free puppy. The puppy is free. The food, the vet and the 6 a.m. walks are not. When AI gives you 5,000 lines of code, it also gives you 5,000 lines to maintain.


## Juniors: don't let the GPS drive your brain


If you always use GPS, you never really learn the city. You get there, but you have no idea where you are. AI is the same for junior developers.


The old way of learning was simple: *write it, break it, fix it, understand it.* With AI, this can quietly turn into: *ask, copy, paste, hope.* You still finish the task, but you learn almost nothing.


Some simple rules that help:


- **Review AI code like a stranger wrote it.** Because a stranger did. If you can't explain a line, don't ship it.
- **Write the test yourself, let AI write the code.** Then *you* decide what "correct" means.
- **Don't paste the error message right away.** Read it for ten minutes first. Reading errors is a skill, and it disappears fast if you never use it.
- **Code without AI once a week.** Pilots still practice flying by hand, even with autopilot.


The junior who gets hired is not the one who produces the most code. It is the one who can answer: *"Why does this work?"*


## Seniors: from cook to head chef


A head chef doesn't cut every onion. But they decide the menu, check every plate before it leaves the kitchen, and know exactly what happens when the fridge breaks on a Saturday night.


The senior developer's job is moving in the same direction:


- **Writing clear specs.** Turning "make it better" into clear rules. A good spec is basically a great prompt.
- **Building safety nets.** Types, tests, linters, CI. You don't trust the AI. You trust the pipeline.
- **Knowing where things break.** Double payments, two users booking the same slot, a database migration that deletes data. AI often misses these, because it learned from average code, and average code misses them too.
- **Saying no.** Sometimes the best feature is the one you never build.


|  | Before AI | After AI |
| --- | --- | --- |
| **Junior** | Writes small tasks, learns by writing | Checks, tests and debugs AI code; can explain it |
| **Senior** | Writes the hard parts, reviews code | Defines the problem, splits the work, builds safety nets |
| **Rare skill** | Writing code fast | Good judgment: knowing what *not* to build |


## Let's be honest: home kitchen vs. restaurant kitchen


Now a confession. At home, on our own side projects, most of us don't read AI code line by line. If it works, we move on. At work, we look at every pull request carefully.


Is that a double standard? Not really. It is like cooking.


At home, you cook in your pajamas, taste the sauce from the spoon and leave the dishes for tomorrow. Nobody cares. In a restaurant kitchen there are hygiene rules, inspections and a lot of hand washing, because if something goes wrong, real customers get sick.


**How carefully you review should depend on how much damage a bug can do.**


|  | Home mode (side project) | Restaurant mode (work) |
| --- | --- | --- |
| **Goal** | Try ideas fast, learn, have fun | Work reliably, every day |
| **If it breaks** | You are sad | Other people get hurt |
| **Review** | "Does it work?" | "Why does it work, and where will it break?" |
| **The code** | Can be thrown away | Will live for years |


Home mode is valuable. Testing an idea in one evening is much better than writing perfect code for three weeks and then finding out nobody wants it.


### The real danger: when your kitchen secretly becomes a restaurant


The problem is not skipping review at home. The problem is when a home project **becomes a real product without you noticing.** If your friends start ordering dinner from your kitchen every night, congratulations: you now run a restaurant, and the hygiene rules apply.


You are not in home mode anymore if:


- someone other than you uses it,
- you store other people's personal data (names, phone numbers, emails),
- there is a login, a password or a payment,
- it is live on a public URL,
- someone depends on it for their job (for example, a business takes bookings through it).


A lot of the "AI slop" apps out there are exactly this: home-kitchen quality, serving restaurant-size crowds.


### Five seatbelts, even in home mode


Even when you are vibe coding, check these five things. They are the most expensive to fix later:


1. **Secrets:** Are your API keys or passwords sitting in the repo?
2. **Access:** If a user changes the ID in the URL, can they see someone else's data?
3. **Delete buttons:** Is there one endpoint or query that can delete everything?
4. **Backups:** If the database dies tonight, can you get it back?
5. **Packages:** Does the package AI added really exist, and can you trust it?


One more tip: side projects are also where you learn. So pick **one important part** of each project (login, the data model, payments) and read that part carefully. Let the rest flow.


> Be fast at home, be careful at work. But the day your side project touches someone's life, you are not at home anymore.


## Know the game, not just the controller


Imagine you are building a booking app for a small football pitch. AI can write the calendar, the login and the database in one afternoon. But AI does not know that:


- the same group of friends has played every Tuesday at 9 p.m. for six years, and the app should keep that slot for them automatically,
- last-minute cancellations are the owner's biggest headache, so the deposit rule is not a small feature, it *is* the business,
- the owner still takes half the bookings by phone, so the app must help him, not fight him.


This knowledge is not on GitHub. It is on the field. And it is what turns a demo into a product.


This is **domain knowledge**: really understanding one area of life or business, like football pitches, dental clinics, logistics or accounting. Knowing a framework's settings by heart is losing value. Knowing a domain deeply is gaining value.


But careful: this does not mean the basics are dead. You still need to understand data modeling, HTTP, databases and transactions, security and logging. Without them, you can't judge what AI gives you.


> If you can't review what AI writes, you are not using AI. AI is using you.


The strongest profile looks like the letter **T**: solid basics across the top, and deep knowledge of one domain going down.


## Anyone can copy the recipe. Nobody can copy your regulars.


When code is cheap, copying is cheap too. Any good idea can be cloned in a weekend. So the thing that protects your product is no longer the code. It is:


- **Reach:** You already know how to get to your users.
- **Trust:** People know you do good work.
- **Data:** Useful history that grows over time.
- **Connections:** Your product is already part of how the customer works.
- **Support:** Someone answers the phone when it breaks at 2 a.m.


Anyone can copy your grandma's soup recipe. Nobody can copy the fact that the whole neighborhood has eaten there every Friday for 20 years.


This also changes how we can make money from software:


- **Small, focused tools for one industry.** Making custom versions is now cheap, so small niches that weren't worth it before can now pay off.
- **Selling the result, not the software.** "Your bookings, handled, for X per month." AI and your system do the work in the background.
- **Running it for them.** The customer isn't buying code. They are buying "it just works."


The catch: support and maintenance are real work. If you don't plan for them, one year later you will be the person babysitting ten projects and improving none of them.


## Code is the output. Value is the outcome.


Users don't care about your tech stack. Nobody has ever said, "I love this app because it uses microservices." They care about one thing: is my life a bit easier now?


Real value is almost always one of these four:


1. **It saves time:** "This took 30 minutes. Now it takes 2."
2. **It saves or makes money:** "The empty slots are full now."
3. **It lowers risk:** "No more double bookings."
4. **It makes decisions easier:** "I can see the whole week in one look."


And how do you measure it? Not with downloads. A café isn't successful because many people walked in once. It is successful because they come back. So look at:


- **Do people come back?**
- **How fast do they get their first win?**
- **Can they finish the thing they came to do?**


## How not to build AI slop


You have seen these apps. Thirty features, and none of them work well. A random AI chatbot that nobody asked for. The same generic design as a thousand other apps. It is like a restaurant with 200 items on the menu: you just know none of them are good.


AI slop doesn't come from AI. It comes from **ideas that nobody really needs.** Someone asked AI "what else can this app do?" instead of "what does my user actually need?"


We test our code before it goes live. Let's test our ideas too:


```
[Problem check]  Is this MY problem, or a problem I have seen a real person struggle with?
      ↓
[User check]     Did I talk to 5 real people before writing any code?
      ↓
[Scope check]    Does it do ONE job well? Did I cut most of the AI's "cool extra features"?
      ↓
[Reality check]  Did I test it with real data, wrong input and a bad internet connection?
      ↓
[Critic check]   Did I ask AI "why will this fail?" and not just "what else can it do?"
      ↓
[Comeback check] Would I use it every day myself? Do people come back?
```


Two questions I like to ask:


- **"If AI didn't exist, would this still be a good idea?"** If the answer is no, it is probably not an idea. It is a demo.
- **"Does it solve my own problem first?"** If you don't use something every day, you can't feel when it is bad. Solve your own problem first, then other people's.


## The career map: level up like a game


Think of your career like a video game. Every level has a mission and a "you can move on when..." rule.


```
LEVEL 0 · THE BASICS
  Learn:   data modeling, HTTP, SQL, git, debugging, basic security
  AI is:   your teacher, not your ghostwriter
  Pass:    you can explain every line of a PR, even the AI-written ones


LEVEL 1 · THE SHIPPER
  Learn:   the full trip: frontend → backend → deploy → monitoring
  AI is:   your pair programmer (you write the tests, it writes the code)
  Pass:    you shipped one real thing that real people use


LEVEL 2 · THE KEEPER
  Learn:   life in production: outages, migrations, speed, cost
  AI is:   your reviewer and debugging buddy
  Pass:    you kept something alive for 6+ months and survived your own bugs


LEVEL 3 · THE DOMAIN EXPERT
  Learn:   one industry, deeply: its rules, its weird cases, how people really work
  AI is:   the hands; you decide what "correct" means
  Pass:    users trust your judgment about their problem, not only your code


LEVEL 4 · THE OWNER
  Learn:   product thinking, priorities, saying no, measuring results
  AI is:   a team of juniors that you guide and review
  Pass:    you are responsible for a result, not just a ticket


LEVEL 5 · THE MULTIPLIER
  Paths:   Staff / Architect · Founder · Consultant · Productized service
  Pass:    your decisions shape what many people (and agents) build
```


One important note: this is not a ladder, it is a skill tree. You can start collecting Level 3 domain knowledge while you are still at Level 1. Actually, you should.


## Side quests: growing outside work


- **Ship something small and keep it alive for three months.** Maintaining teaches you more than building.
- **Read the source code of a library you use.** You will see design decisions that AI never shows you.
- **Write about what you learn.** A blog post, a short postmortem, a decision note. If you can't explain it in writing, you don't really understand it yet.
- **Pick a domain and talk to the people in it.** This is the best investment outside of code.


## Not a developer? You can still build.


If you don't have a deep software background but you want to build something:


- **Start with a problem you know well.** You already have the domain advantage. Use it.
- **AI for the prototype, an engineer for the real thing.** Build the first version yourself. Before real users put real data in it, ask an engineer to look at it.
- **Learn three questions:** Where is my data stored? Who can see what? How will I know when something breaks?
- **Don't build the scary parts yourself.** Use ready-made services for login, payments and email.


## The bottom line


AI made writing code available to everyone. That is great news, but it also means writing code is no longer what makes you special.


What makes you special now is this: **picking the right problem, proving that your solution works, and taking responsibility for the result.**


The robot can cook. Someone still has to run the restaurant.
