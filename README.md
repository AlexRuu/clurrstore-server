# Clurr Store Front End

A backend component for an e-commerce project.

## Introduction

This is the server component required for the front end project that can be viewed [here](https://clurr-store-front.vercel.app/). This project provides a user interface for the admin to update the products, view an overview of the shop, and update categories related to the products.

![](https://github.com/AlexRuu/clurrstore-front/blob/main/demo.gif)

## Getting Started

### Requirements

[Node.js 18.17](https://nodejs.org/) or later is required for this project.

<details>
<summary>Windows</summary>
The easiest method would be to download the <a href="https://nodejs.org/en/download">installer</a>
</details>

<br/>
<details>
<summary>MacOS</summary>
You can install Node.js via Homebrew:

<ul><li>Download and installs Homebrew (macOS/Linux Package Manager): </li>

```sh
 /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

<li>download and install Node.js </li>

```sh
  brew install node@20
```

<li>verifies the right Node.js version is in the environment</li>

```sh
node -v # should print `v20.11.1`
```

<li>verifies the right NPM version is in the environment</li>

```sh
npm -v # should print `10.2.4`
```

</ul>
</details>

### Installation

```
$ git@github.com:AlexRuu/clurrstore-front.git
$ cd clurrstore-front
$ npm install
```

### Configure Application

- This application requires the access to the following:
  - The [server application](https://github.com/AlexRuu/clurrstore-server) for the api route
  - Access to a [Supabase Account](https://supabase.com/)
    - This will require the Supabase project keys that can be accessed in the project settings

### Starting

Run the following to get the application running

```sh
$ npm run dev
```

## Features

- Built with [Typescript](https://www.typescriptlang.org/)
- [Next.js](https://nextjs.org/)
  - [React](https://react.dev/) for the UI
- [Supabase](<(https://supabase.com/)>) for authentication
- Styling with [Tailwind CSS](https://tailwindcss.com/)
- [Stripe](https://stripe.com/en-ca) for the checkout process
