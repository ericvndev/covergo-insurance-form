# Solution

## Video

First of all, here is the link to the Youtube video where I explained more details about the solution:


## Technical stacks

For technical choices, although this is a just a simple exercise, I want to take it seriously like a real project. I also want to learn more about the VueJS tech stacks, so I chose Covergo's current tech stacks and applied them to this project which are:

- **Vue3** with **Typescript**
- **Vite**
- **TailwindCSS**
- **Vitest** for unit testing (I think Jest will be more popular but Vitest is good enough).

I'm new to all of this technologies so it's take me quite a time for both learning and coding at same time, but 3-days dealine is enough for me since I'm a fast learner. I also added **ESLint** to keep me from minor syntax errors and **Prettier** for auto formatting code.

## Architecture

About the folder structure, I use `npm init vue@latest` command to init the project so I think the folder structure is typical in VueJS developing. So here it is:
```
+-- public/ (static items)
+-- src/
|   +-- assets/ (css)
|   +-- components/ (small modules with test)
|       +-- forms/ (forms components)
|       +-- icons/ (svg icons)
|   +-- router/ (for routing)
|   +-- types/ (Typescript types definitions)
|   +-- views/ (pages with test)
|   +-- App.vue
|   +-- main.ts
+-- index.html
+-- *.config.js
```

In my opinion, although there are 4 screens in the design, they are all fit in one webpage and share the same data. So I created a view called **BuyInsuranceView**, this will be the page when user want to purchase some insurance packages in one big website. I treated this as child page so I put it on route "/buy-insurance" and since there is no homepage yet, I redirect path "/" to "/buy-insurance". There are 4 smaller components which are 4 screens in the design:
- **CallToAction** (Welcome Screen)
- **MainForm** (Form Screen)
- **FormSummary** (Summary Screen)
- **ErrorMessage** (Error Screen)
I don't want to duplicate myself so I also created a small component called **FormButton** to render buttons in the app.

## Data structure

Because all 4 components share the same data, all data will be stored and processed in parent component which is **BuyInsuranceView** component. This is to make sure the Single Source of Truth rule. There are 2 types of data storing here, **FormData** to store user form input data and **ServerData** to store data that I think should be fetched from the server. The **ServerData** is now just a mock and consist of a **Country** list and a **InsurancePackage** list. The data will then be transfered to all children components who needed using props. Checkout the video above, I will explain more detail about how the data flow works.