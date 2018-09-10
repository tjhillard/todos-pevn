# todos-pevn-stack

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
* Progressive Web App Support
* Reset/forgot password functionality
* Emails with SendGrid transactional email templates
* e2e testing with Cypress
* Unit & API integration tests with Jest
* Test coverage tracking with Istanbul
* CI/CD with CircleCI
* Code linting with ESLint

## Running Locally

Run dev server
```bash
npm run serve
```

Build project assets
```bash
npm run build
```

Run dev API
```bash
node bin/www
```

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