<p align="center">
<img width="300" src="/frontend/public/logo.png" />
</p>

# Company Management System

## Description

This is a full-stack application built with [Nest.js](https://nestjs.com/) and [Vue.js](https://vuejs.org/).

## Authentication

This application uses JSON Web Tokens (JWT) for authentication. When a user logs in, they receive two tokens: an access token and a refresh token.

### Access Token

The access token is short-lived and used to make authenticated requests to the API. It is sent in the `Authorization` header of each request.

### Refresh Token

The refresh token is long-lived and used to get a new access token when the current one expires. For security, it is stored in a HttpOnly cookie in the user's browser, which protects it from being accessed by client-side scripts. The refresh token is sent to the server to issue a new access token when the current one expires.

When the access token expires, the application automatically uses the refresh token to get a new access token, allowing the user to continue using the application without needing to log in again.

## Features

This application includes the following pages:

- Home
- Register
- Login
- Department Management
- Company Management

### Home

The Home page is the landing page of the application. It provides an overview of the application and its features. Users can navigate to other parts of the application from here.

<p align="center">
<img width="700" src="/frontend/public/landingpage.png" />
</p>

### Register

The Register page allows new users to create an account in the application. Users need to provide their details such as name, email, and password to register. After successful registration, users will be able to log in to the application with their credentials.

### Login

The Login page allows existing users to log in to the application. Users need to provide their registered email and password. After successful login, users will be able to access the features of the application.

### Department Management

In the Department Management page, you can add, edit, and delete departments. To add a new department, click on the "Add Department" button, fill in the department's details in the form, and click "Save".

<p align="center">
<img width="700" src="/frontend/public/departmentpage.png" />
</p>

### Company Management

In the Company Management page, you can add, edit, and delete companies. To add a new company, click on the "Add Company" button, fill in the company's details in the form, and click "Save".

<p align="center">
<img width="700" src="/frontend/public/companies.png" />
</p>

### Multilingual Support

This application supports multiple languages. You can switch between languages using the language selector in the application.

### Responsive Design

The application is designed to be responsive and provides an optimal viewing and interaction experience across a wide range of devices. Whether you're on a desktop, laptop, tablet, or smartphone, you'll be able to use all the features of the application with ease.

## Tech Stack

- Back-end: Nest.js
- Front-end: Vue.js
- Database: (Postgresql,elasticsearh)
- ORM: (Typorm)
- Other technologies: (Vuefity)

## Installation

First, install the dependencies for the back-end:

```bash
cd backend
yarn
```

Then, install the dependencies for the front-end:

```bash
cd frontend
yarn
```

## Running the app

To run the back-end:

```bash
cd backend
# development
yarn start

# watch mode
yarn  start:dev

# production mode
yarn start:prod
```

To run the front-end:

```bash
cd frontend
yarn dev
```
