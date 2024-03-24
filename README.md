# Clurr Store Server

A server for an e-commerce project.

## Introduction

This is the server component required for the front end project that can be viewed [here](https://clurr-store-front.vercel.app/). This project provides a user interface for the admin to update the products, categories, and view other admin related information. It is also the server that allows the front end to retrieve data from the database.

![](https://github.com/AlexRuu/clurrstore-server/blob/main/demo.gif)

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
$ git clone git@github.com:AlexRuu/clurrstore-server.git
$ cd clurrstore-server
$ npm install
```

### Configure Application

- This application requires the access to the following:
  - Access to a [Supabase Account](https://supabase.com/)
    - This will require the Supabase project keys that can be accessed in the project settings
  - Access to a [Stripe](https://stripe.com/en-ca) account
    - It will require the stripe API keys and webhook secret that are associated with your account
  - [Cloudinary](https://cloudinary.com/) is also required as it is used to store product images

### Starting

Run the following to get the application running

```sh
$ npm run dev
```

## Features

- Built with [Typescript](https://www.typescriptlang.org/)
- [Next.js](https://nextjs.org/)
  - [React](https://react.dev/) for the UI
- [Supabase](https://supabase.com/) is used for the database and authentication
- Styling with [Tailwind CSS](https://tailwindcss.com/)
- [Stripe](https://stripe.com/en-ca) is used fo the payment process
- [Prisma](https://www.prisma.io/) is the ORM used to manipulate the database
