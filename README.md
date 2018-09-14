# todos-pevn

<p align="center">
  <img src="https://i.gyazo.com/52ae65b02cbbbd7a04033c4bf4f15444.png" width="300px"/><br>
  <img src="http://mean.io/wp-content/themes/twentysixteen-child/images/express.png" width="300px"/><br>
  <img src="https://i.gyazo.com/f718dd2c78aaae01bc219d14d1888d26.png" width="300px"/><br>
</p>

A simple todo application built for learning purposes.

## Stack
* PostgreSQL
* Knex.js
* Express / Node
* Vue / Vue Router / Vuex

## Features
* User authentication & authorization with JWT
* RESTful JSON API
* Reset/forgot password functionality
* Emails with SendGrid
* e2e testing with Cypress
* Unit & API integration tests with Jest
* Test coverage tracking with Istanbul
* CI/CD with CircleCI
* Code linting with ESLint

## Setup

1) Database can be anything supported by Knex.js. PostgreSQL was used during development with:

* Postgres.app - https://postgresapp.com/
* Postico - https://eggerapps.at/postico/

Customize `knexfile.js` in the project root to configure your connection info.

Migrations need to be ran with: `knex migrate:latest` assuming you have `knex` installed globally.

2) Environment Variables

```
# can be any string you want, used to sign JWT's
JWT_TOKEN_SECRET=
# Get from https://app.sendgrid.com/ after making an account
SEND_GRID_KEY=
```

Emails will requrie additional configuration of `http/services/mailer-service.js` to replace the SendGrid template ID's with valid templates associated to your access key used above. The welcome template has no special requirements but the reset password template needs to include something along these lines:

```html
<a href="http://{{host}}/reset_password?token={{token}}">
  <button>
    Reset Your Password
  </button>
</a>
```

3) Install dependencies

```bash
npm install
```

4) Build project files

```bash
npm run build
```

5) Run API

```bash
node bin/www
```

6) Application running at `http://localhost:3000`. Run `npm run serve` if you want to run the development server with hot reloading. The development server proxies application network requests to `localhost:3000/`.

## Tests

Unit Tests (Jest)
```bash
npm run test:unit
```
API Integration Tests (Jest)
```bash
npm run test:api
```

E2E Tests (Cypress)
```bash
npm run test:e2e
```

## Documentation

* API Docs: https://documenter.getpostman.com/view/112421/RWaKR7oq