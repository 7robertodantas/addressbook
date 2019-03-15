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
[docker-install-url]: https://docs.docker.com/install/
[docker-compose-install-url]: https://docs.docker.com/compose/install/
[native-mongodb-driver-url]: https://mongodb.github.io/node-mongodb-native/
[firebase-server-url]: https://github.com/urish/firebase-server
[mongodb-memory-server-url]: https://github.com/nodkz/mongodb-memory-server
[open-api-url]: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md


# Addressbook

[![Build Status](https://travis-ci.com/7robertodantas/addressbook.svg?branch=master)](https://travis-ci.com/7robertodantas/addressbook)
[![codecov](https://codecov.io/gh/7robertodantas/addressbook/branch/master/graph/badge.svg)](https://codecov.io/gh/7robertodantas/addressbook)
[![Known Vulnerabilities](https://snyk.io/test/github/7robertodantas/addressbook/badge.svg?targetFile=package.json)](https://snyk.io/test/github/7robertodantas/addressbook?targetFile=package.json)

A simple but reliable and well structured address book backend api. It allows users to manage their personal info and store as many contacts as they want :)

# Getting Started

### Testing

To run the tests it is pretty straightforward, you can run it without doing any configuration. It's already configured and it will start by default an embedded [in memory mongodb server][mongodb-memory-server-url] and an [embedded firebase server][firebase-server-url] as well. You should be able to run the tests by executing the following command (Just make sure you have [npm][npm-url] globally installed and that you've installed the dependencies. Note: some libraries may need to have python installed):

```
npm install
npm run test
```

### Running

In order to run locally you must have some [mongodb][mongodb-url] instance running in your machine or in some server that you have access to it from your local machine.

#### Manually using config files
You can set your [mongodb][mongodb-url] settings by changing the config file corresponding to your `NODE_ENV` environment variable. By default it will be `config/development`, unless if you had set `NODE_ENV` to something else or are executing the tests, which changes it to `test`. After changing the correspondent config file to your environment according to your needs, you should be able to execute the following command and run:

```
npm install
npm start
```

For more details on how the config library works, please check the [node-config][node-config-url] documentation.

#### Manually overriding default values by environment variables
You can override some configuration described in `config/default.json` by using its correspondent environment variable defined in `config/custom-environment-variables.json`. for example, the `mongodb.uri` property corresponds to `MONGODB_URI` environment variable. You can find below an example of using this technique:

```
npm install
MONGODB_URI=mongodb://localhost:27017/addressbook npm start
```

For more details on how the config library works, please check the [node-config][node-config-url] documentation.

#### Dockerfile and Docker Compose
I've prepared a [Dockerfile][dockerfile-url] and a [docker-compose][docker-compose-url] file that should run without doing any configuration, unless if you have another container or service running in the same port: `3000` as I defined in the `app` service. If so, I suggest you to change the docker-compose port mapping in the `app` service before running it. Assuming that you have [docker][docker-install-url] and [docker-compose][docker-compose-install-url] installed in your machine, run the command below:

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

I tried as much as possible to separate responsibilities on each module/layer. For instance, I assumed that only the `models` layer should know how to manage, change, customize and validate a given schema object and it should only send a data to `db` layer after it is valid. The `db` layer, on the other hand, should be concerned only in knowing how to communicate to the database and in obeying the "implicit" contract of returning an `id` property in every saved object. Last but not least, I assumed that the `middleware` and `routes` layers should avoid to import and use `db` layer directly, as it doesn't do nor have any sort of validation, they should rely on `models` module instead.


### Components

| Folder / File | Description |
|:--------------|:------------|
| **app.js** | This file configures the app and add all routes |
| **index.js** | This file imports the app and starts a http server |
| **/routes** | This module contains all things related to http mapping and `express` endpoints. |
| **/middleware** | This module contains all middlewares used in `express` routes. |
| **/models** | This module contains all data schema validation and management. |
| **/db** | This module contains all database's communication, queries and configurations. |
| **/logger** | This module centralizes the a common logger to use throughout the application. |
| **/log** | This folder is by default the logger output. It's where you should expect logs. |

# Endpoints

The following endpoints are here just for a brief overview. There is an api documentation built following the [OpenAPI Specification][open-api-url] in [*docs/documentation.html*](docs/documentation.html), it's a zero-dependency HTML file that specifies every route and every possible response sample and status.

## Login and Registration
#### POST /register
Request sample:
```
{
    "email": "email@gmail.com",
    "password": "test"
}
```
Response sample:
```
{
    "id": "5c89b520aaf712001020e57c",
    "email": "email@gmail.com"
}
```

#### POST /login
Request sample:
```
{
    "email": "email@gmail.com",
    "password": "test"
}
```
Response sample:
```
{
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNWM4OWI3NDRjZGM2YjMwMDExNzhmMjBlIiwiZW1haWwiOiJlbWFpbEBnbWFpbC5jb20ifSwiaWF0IjoxNTUyNTI5MjIyLCJleHAiOjE1NTI1MzI4MjIsImlzcyI6ImFkZHJlc3Nib29rLWFwaSJ9.P3Tsw4LId8Tutm0lhWRv3mIPKhiRCj5_Hd9Wq-xo3IY",
    "tokenType": "bearer"
}
```

#### GET /tokeninfo
The following endpoint requires an `Authorization` header with the `Bearer <token>` obtained from `/login`.
Response sample:
```
{
    "id": "5c89b520aaf712001020e57c",
    "email": "email@gmail.com"
}
```

## Users
These endpoints requires an `Authorization` header with the `Bearer <token>` obtained from `/login`.

#### GET /users/:userId
Response sample:
```
{
    "id": "5c89b744cdc6b3001178f20e",
    "name": "Custom Name",
    "email": "user@email.com"
}
```

#### PUT /users/:userId
Request sample:
```
{
    "name": "Custom Name",
    "email": "changedEmail@email.com",
    "password": "newPassword"
}
```

Response sample:
```
{
    "id": "5c89b744cdc6b3001178f20e",
    "name": "Custom Name",
    "email": "changedEmail@email.com"
}
```

#### PATCH /users/:userId
Request sample:
```
{
    "email": "changedOnlyEmail@email.com"
}
```

Response sample:
```
{
    "id": "5c89b744cdc6b3001178f20e",
    "name": "Custom Name",
    "email": "changedOnlyEmail@email.com"
}
```

#### DELETE /users/:userId
Response sample:
```
{
    "id": "5c89b744cdc6b3001178f20e",
    "name": "Custom Name",
    "email": "changedOnlyEmail@email.com"
}
```

## Contacts
The following endpoint requires an `Authorization` header with the `Bearer <token>` obtained from `/login`.

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
During the development process I had some challenges and decisions to make. e.g. whether to one library or not, how handle the configuration, how handle the schema validations, etc. I'll try to summarize some of them in this section.

#### Database and ORM/ODM
I had to decide whether I should use an ORM/ODM or not, and also, whether I should use a relational database or a non relational database. For that, I've put into account that an address book api wouldn't need so much concern about data integrity nor atomicity, an eventual consistency wouldn't be a problem, so, that was one of the reasons that made me opt to use [mongodb][mongodb-url]. 

After I decided to use [mongodb][mongodb-url], I considered to use some ODM, such as [mongoose][mongoose-url], after all, they have some features to facilitate development, for instance, the schema validation, pre register hooks etc. But I concluded that It wouldn't be good to rely the schema validation into some specifc database library, cause this project also uses other databases, for instance, the `contact` model that is stored in [firebase][firebase-url] rather than in mongo. So, I've opted to use the [native mongo driver][native-mongodb-driver-url] to connect to the database and find some library for schema validation.

#### Schema Validation
As described in the previous section, [Database and ORM/ODM](#database-and-ormodm), I've decided to use a custom library for schema validation rather than using some ODM built in validation. For that, I decided to use [Joi][joi-url], in this case, my decision was more related to its popularity and documentation rather than any specific feature.

#### Patch Method
The [PATCH Method for HTTP][patch-method-rfc] specification doesn't describe exactly the payload format that should be sent to apply partial changes, it describes only that the payload should be a description of changes. So, I've decided between [JSON Patch][json-patch-rfc] notation and [JSON Merge Patch][json-merge-patch-rfc], for the sake of simplicity, I decided to use the second one, which in simple words, allows you to use the same resource schema by just omitting the properties that won't change and declaring only the properties that is intended to modify.

#### /contacts or /users/{userId}/contacts
A question that raised in my mind while I was designing the api routes was if it is a good approach to use an endpoint that changes accordingly to the authenticated user. When it comes to the contacts endpoint, I had to decide whether to use `/contacts` endpoint (differentiating by token) or use `/users/{userId}/contacts` endpoint. I've found a stackoverflow topic discussing something similar to the question that I had: [Is an API endpoint that differentiates what resources to return based on user credentials RESTful and good URI design?
](https://stackoverflow.com/questions/29005275/is-an-api-endpoint-that-differentiates-what-resources-to-return-based-on-user-cr) I liked the approach addressed in this [response](https://stackoverflow.com/questions/29005275/is-an-api-endpoint-that-differentiates-what-resources-to-return-based-on-user-cr/42735544#42735544), so I decided to follow a similar pattern, using the resource id explicitly in the URL and validating if the user has permission to access it.

#### Configuration
It isn't so good to manage all configuration settings throughout the code using environment variables, as described in [eslint-no-process-env][eslint-no-process-env-url] it could lead to maintenance issues as it’s another kind of global dependency. I could solve that by creating a module to centralize all env variables, but I decided to do some googling to find a good library to do that. I've found [dotenv][dotenv-url] and [node-config][node-config-url], I decided to use the second one since it allows to define some sort of hierarchical configuration and default values.

#### Logging
Initially, I've used [debug][debug-url] library, it is intended to be used only in development environment, and it's not really a logging library, it lacks of some features such as saving do file, logging level, etc. So, after a while, I've changed it to [winston][winston-url] for its popularity in the community and some features such as multiple logging transportation and so forth.

#### Error Handling
I felt the necessity to standardize the error messages and error handling, so, I found a good library [Boom HTTP-friendly error objects][boom-url] which helps a lot to maintain the same pattern all over the thrown errors. Alongside with that, I decided to create a "global uncaught error handler" which is the errorHandler middleware.

#### Authentication
For this case, I had to use some stateless strategy, so I've opted to use [jwt][jwt-rfc-url], and I find unnecessary to use some 3rd party library to authenticate the users, for that I've made myself a middleware that verifies the authorization token header.

#### Framework
I had to choose between [koa][koa-url] and [express][express-url]. Even though I wanted to use [koa][koa-url], I've opted to use express js in this project due to my previous knowledge with it.

#### Testing Library
I've opted to use [jest][jest-url] rather than the well known [mocha][mocha-url] cause [jest][jest-url] has everything built into it - from matchers to mocks.

# Further Improvements
- Increase tests coverage.
- Move unique user's email constraint to mongodb to avoid race conditions that may occur in parallel requests.
- Separate jest environments for unit testing and integration testing.
- Configure setup/teardown of embedded mongo and firebase to run only in integration test environment. Currently it is running up in every test execution.
- Improve firebase-end security by adding some sort of validation / authentication in the data sent to firebase and restricing read/write access to each user contacts collection.
- Upgrade to es6 features - import and export. It may need to install babel transpiler and configure deployment to use de output dist folder.
- Separate the node files in src/ folder.
- Change jwt algorithm to RS256 and use private/public keys.
- Implementation of contacts management endpoints.
- Define versioning style and project license type.
- Refactor tests to reuse code.