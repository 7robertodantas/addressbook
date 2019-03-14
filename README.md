[jest-url]: https://github.com/facebook/jest
[mocha-url]: https://github.com/mochajs/mocha
[joi-url]: https://github.com/hapijs/joi
[mongoose-url]: https://github.com/Automattic/mongoose
[firebase-url]: https://firebase.google.com
[mongodb-url]: https://mongodb.com
[koa-url]: https://github.com/koajs/koa
[express-url]: https://github.com/expressjs/express
[debug-url]: https://github.com/visionmedia/debug
[winston-url]: https://github.com/winstonjs/winston
[eslint-no-process-env-url]: https://eslint.org/docs/rules/no-process-env
[dotenv-url]: https://github.com/motdotla/dotenv
[node-config-url]: https://github.com/lorenwest/node-config
[patch-method-rfc]: https://tools.ietf.org/html/rfc5789
[json-patch-rfc]: https://tools.ietf.org/html/rfc6902
[json-merge-patch-rfc]: https://tools.ietf.org/html/rfc7386
[jwt-rfc-url]: https://tools.ietf.org/html/rfc7519
[boom-url]: https://github.com/hapijs/boom
[npm-url]: https://github.com/npm/cli
[dockerfile-url]: https://docs.docker.com/engine/reference/builder/
[docker-compose-url]: https://docs.docker.com/compose/

# Addressbook

[![Build Status](https://travis-ci.com/7robertodantas/addressbook.svg?branch=master)](https://travis-ci.com/7robertodantas/addressbook)
[![codecov](https://codecov.io/gh/7robertodantas/addressbook/branch/master/graph/badge.svg)](https://codecov.io/gh/7robertodantas/addressbook)
[![Known Vulnerabilities](https://snyk.io/test/github/7robertodantas/addressbook/badge.svg?targetFile=package.json)](https://snyk.io/test/github/7robertodantas/addressbook?targetFile=package.json)

A simple but reliable and well structured address book backend api. It allows users to manage their personal info and store as many contacts as they want :)

# Getting Started

### Testing

To run the tests is pretty straightforward, you can run without configure anything. It's already configured and by default it will start an embedded in memory mongodb and an embedded firebase server as well. You should be able to run the tests by executing the following command (Just make sure you have [npm][npm-url] globally installed and that you've installed the dependencies. Note: some libraries may need to have python installed):

```
npm install
npm run test
```

### Running

In order to run locally you must have some [mongodb][mongodb-url] instance running in your machine.

#### Manually using config files
You can set the [mongodb][mongodb-url] settings by changing the config file corresponding to the `NODE_ENV`. By default it will be `config/development`, unless you set `NODE_ENV` to something else or ran the tests, which changes it to `test`. After changing the config file properties according to your setup, you should be able to execute the following command and run:

For more details on how the current config library works, please check the [node-config][node-config-url] library page.

```
npm install
npm start
```


#### Manually overriding default values through environment variables
You can override some configuration described in `config/default.json` by using its correspondent environment variable defined in `config/custom-environment-variables.json`. for example, the `mongodb.uri` property corresponds to `MONGODB_URI` environment variable. You can find below an example of using this technique:

```
npm install
MONGODB_URI=mongodb://localhost:27017/addressbook npm start
```

For more details on how the current config library works, please check the [node-config][node-config-url] library page.

#### Dockerfile and Docker Compose
I've prepared a [Dockerfile][dockerfile-url] and a [docker-compose][docker-compose-url] file that should run without any changes, unless you have another container or service running in the same port: `3000` as I defined in the `app` service. If so, I suggest you to change the docker-compose port mapping in the `app` service before running it. Assuming that you have 

```
docker-compose build
docker-compose up
```


## Table of content

- [Getting Started](#getting-started)
  - [Testing](#testing)
  - [Running](#running)
- [Architecture](#architecture)
  - [Principles](#principles)
  - [Components](#components)
  - [Logging](#logging)
- [Endpoints](#endpoints)
  - [Login and Registration](#login-and-registration)
  - [Users](#users)
  - [Contacts](#contacts)
- [Project Decisions](#project-decisions)
- [Further Implementation](#further-implementation)

# Architecture
<p align="center">
  <img src="docs/assets/overview.png">
</p>

### Principles

### Components

#### Routes

#### Middleware

#### Models

#### Database

#### Logger

# Endpoints

## Login and Registration

#### POST /login
Request example:
```
{
	"email": "email@gmail.com",
	"password": "test"
}
```
Response example:
```
{
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNWM4OWI3NDRjZGM2YjMwMDExNzhmMjBlIiwiZW1haWwiOiJlbWFpbEBnbWFpbC5jb20ifSwiaWF0IjoxNTUyNTI5MjIyLCJleHAiOjE1NTI1MzI4MjIsImlzcyI6ImFkZHJlc3Nib29rLWFwaSJ9.P3Tsw4LId8Tutm0lhWRv3mIPKhiRCj5_Hd9Wq-xo3IY",
    "tokenType": "bearer"
}
```

#### POST /register
Request example:
```
{
	"email": "email@gmail.com",
	"password": "test"
}
```
Response example:
```
{
    "id": "5c89b520aaf712001020e57c",
    "email": "email@gmail.com"
}
```

## Users

These endpoints requires an `Authorization` header with the `Bearer <token>` obtained from `/login`.

#### GET /users/:userId
Response example:
```
{
    "id": "5c89b744cdc6b3001178f20e",
    "name": "Custom Name",
    "email": "user@email.com"
}
```

#### PUT /users/:userId
Request example:
```
{
    "name": "Custom Name",
    "email": "changedEmail@email.com",
    "password": "newPassword"
}
```

Response example:
```
{
    "id": "5c89b744cdc6b3001178f20e",
    "name": "Custom Name",
    "email": "changedEmail@email.com"
}
```

#### PATCH /users/:userId
Request example:
```
{
    "email": "changedOnlyEmail@email.com"
}
```

Response example:
```
{
    "id": "5c89b744cdc6b3001178f20e",
    "name": "Custom Name",
    "email": "changedOnlyEmail@email.com"
}
```

#### DELETE /users/:userId
Response example:
```
{
    "id": "5c89b744cdc6b3001178f20e",
    "name": "Custom Name",
    "email": "changedOnlyEmail@email.com"
}
```

## Contacts

#### POST /users/:userId/contacts
Request example:
```
{
    "name": "A contact name",
    "email": "contact@email.com",
    "address": {
        "street": "St Louis 1",
        "zipCode": "350120"
    }
}
```

Response example:
```
{
    "id": "-L_tz2-qfEMaHUeM9NsG",
    "name": "A contact name",
    "email": "contact@email.com",
    "address": {
        "street": "St Louis 1",
        "zipCode": "350120"
    }
}
```

# Project Decisions
During the development process I had some challenges and decisions to make. e.g. whether using one library or not, how handle the configuration, how handle the schema validations, etc. I'll try to summarize some of them in this section.

#### Testing Library
One of them was which testing library use, I've opted for using [jest][jest-url] instead of the well known [mocha][mocha-url] cause [jest][jest-url] has everything built into it - from matchers to mocks.

#### Database and ORM/ODM
Another decision that I had to make was whether use an ORM/ODM or not, and also, whether using a relational database or non relational database. For that, I've put into account that an address book api wouldn't need so much concern with data integrity nor atomicity, an eventual consistency wouldn't be a problem, so, that was one of the reasons that made me opt for using [mongodb][mongodb-url]. 

After I decided to use [mongodb][mongodb-url], I considered using some ODM, such as [mongoose][mongoose-url], after all, they have some features to facilitate development, for instance, the schema validation, pre register hooks etc. But I decided that It wouldn't be good to rely the schema validations on some specifc database library, It wouldn't work for other schemas that are not stored in mongodb, one example of that is the contact model that is stored in [firebase][firebase-url]. So, I opted to use the native mongo driver in this case.

#### Schema Validation
As described in the previous section of [Database and ORM/ODM](#database-and-ormodm), I've decided to use a custom library for schema validations rather than using some ODM. For that, I decided to use [Joi][joi-url], in this case, my decision was more for its popularity and documentation.

#### Framework
I had to choose between [koa][koa-url] and [express][express-url]. Even though I wanted to use [koa][koa-url], I've opted to use express js in this project due to my previous knowledge with it.

#### Logging
Initially, I've used [debug][debug-url] library, it is intended to be used only in development environment, and it's not really a logging library, it lacks of some features such as saving do file, logging level, etc. So, after a while, I've changed it to [winston][winston-url] for its popularity in the community and features for multiples logging transportation and so forth.

#### Configuration
It isn't so good to manage all configuration settings throughout the code using environment variables, as described in [eslint-no-process-env][eslint-no-process-env-url] it could lead to maintenance issues as it’s another kind of global dependency. I could solve that by creating a module to centralize all env variables, but I decided to do some googling to find a good library to do that. I've found [dotenv][dotenv-url] and [node-config][node-config-url], I decided to use the second one since it allows to define some sort of hierarchical configuration and default values.

#### Patch Method
The [PATCH Method for HTTP][patch-method-rfc] rfc doesn't describe exactly the payload data that should be sent to apply partial changes, it describes only that the payload should be a description of changes. So, I had to decide between using [JSON Patch][json-patch-rfc] notation and [JSON Merge Patch][json-merge-patch-rfc], for the sake of simplicity, I decided to use the second one, which in simple words, allows you to use the same resource schema by just omitting the properties that won't change and declaring only the properties that is intended to modify.

#### Error Handling
I felt the necessity to standardize my error messages and error handling, so, I found a good library [Boom HTTP-friendly error objects][boom-url] which helps a lot to maintain the same pattern all over the thrown errors. Alongside with that, I decided to create a "global uncaught error handler" which is the errorHandler middleware.

#### Authentication
For this case, I had to use some stateless strategy, so I've opted to use [jwt][jwt-rfc-url], and I find unnecessary to use some 3rd party library to authenticate the users, for that I've made myself a middleware that verifies the authorization token header.

# Further Improvements
- Increase tests coverage.
- Separate jest environments for unit testing and integration testing.
- Configure setup/teardown of embedded mongo and firebase to run only in integration test environment. Currently it is running up in every test execution.
- Improve firebase-end security by adding some sort of validation / authentication in the data sent to firebase and restricing read/write access to each user contacts collection.
- Upgrade to es6 features - import and export. It may need to install babel transpiler and configure deployment to use de output dist folder.
- Separate the node files in src/ folder.
- Change jwt algorithm to RS256 and use private/public keys.
- Implementation of contacts management endpoints.
- Define versioning style and project license type.
- Refactor tests to reuse code.