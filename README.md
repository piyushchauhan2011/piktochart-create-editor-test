## Instructions

You are required to implement a single page application that allows user to add text and image into canvas.

## Features

Below are the basic features for the application:

- *(done)* user can see the existing images from folder `images` to the images list
- *(done)* user can *upload image* to folder `images` and directly added to images list
- *(done)* user can *add and remove image / text* from the menu to the canvas
- *(done)* user can *move the image / text* around the canvas

Bonus points if you can provide this feature:

- *(done)* the created objects on canvas can be saved and repopulated on refresh browser

## Resources

You will be given a HTML and CSS file with simple structure, and a server that allows you to upload and retrieve image. Instruction on how to run the server is included below.

## Requirements

Here are the expected requirements:

- *(done)* App should have the features listed [above](#features)

- *(done)* App should work on modern browsers (Chrome / Firefox)

- *(not used)* App logic and data flow are written in a functional and reactive way

    Separate the logic between app state and view / user interactions (unidirectional data flow). 

- Try to avoid using libraries as much as possible

    *(not used)* If you need to use libraries, we recommend ReactJS, RxJS / xstream, CycleJS, and jQuery.

    _note: use native HTML element `<div>` for editor canvas, not `<canvas>`_

Bonus points given for these requirements:

- Code and flow should be properly documented

    *(added)* Help us understand your flow easier by code comments or a readme file.

- *(very little)* Build automated test for the app


## How to Submit

- Zip your working folder with the name `piyushchauhan-piktojstest`

- Exclude `node_modules` folder from the zip

- If you're using github or any code management tools, you can pass us the link

- You have **one day** to complete the test. If you are not able to finish, do send us whatever you have done, we will evaluate accordingly. If you need more time to fulfill all the features and requirements, we can give you **an extra day**

Have fun programming 😊

## How To Install

To set up the environment dependencies ( node version 5++ )

```
$ npm install
```

To run the node server

```
$ npm run start
```

Server is listening to port `8000`

### API

#### get uploaded images

```
GET /images
```

#### upload image to server

```
POST /uploads
```

#### run tests

```
GET /test
```

#### get app state

```
GET /state
```

#### update app state

```
POST /state
```

### Note

_- The name of the file input has to be `upload` as this is what the server will be reading from_
_- The server only accepts `png` and `jpeg` file format_
_- You are allowed to edit the server.js file_


## Solution

It's been lovely solving the above challenge. I've marked the `done`, `not used` and `very little` in the above instructions for reflecting what is been implemented, used and could have implemented more.

The current solution uses plain javascript, `unfetch` polyfill for doing ajax requests and `interactjs` is used for dragging.

I tried to use `RxJS` after reading it for a while and implemented basic draggable function but after testing I found it not at par with interactjs. If you try to move cursor faster while dragging it loses context and disable dragging or behaves in abnormal way.

Initially I started to avoid any library and after a while to manage state, I realised that I should have used `React` and uni-directional data flow pattern. Anyway, the current state management is just mutations and doesn't fire any actions to update state or trigger down the changes to DOM after state change. Might have to re-implement again in `ReactJS`.

Most of the code is documented with the comments to what function is doing or if anything complex with inline-comments to point out what is happening at that line of code. Class pattern is avoided to support browsers instead namespace object is used to encapsulate `app` state, `ui` references and functions.

There is `utils` object which encapsulate the basic functions that doesn't depend directly on `app` and can be testable through unit tests. While `app` object requires functional test which I haven't included. There is `FuncUnit` and `Protractor` to perform end-to-end testing, not enough time.

There are three new routes. `body-parser` is incuded to parse the request for data.
1. GET `/test` for running the tests
2. GET `/state` for fetching the current state from server
2. POST `/state` for saving and updating the current state on server

**Cheers 😊**

**Piyush Chauhan**