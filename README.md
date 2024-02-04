# Welcome to Remix!

- [Remix Docs](https://remix.run/docs)

## Development

From your terminal:

```sh
npm run dev
```

This starts your app in development mode, rebuilding assets on file changes.

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `remix build`

- `build/`
- `public/build/`

## INFO

The branch has three contract files Token.sol, Client.sol and Server.sol.
These are used to simulate the working of the mess, with students being the client and mess being server.

## RUNNING TESTCASES

The code written can be tested in terminal. Clone the repo on localhost.
Install truffle.
```sh
$ npm i -g solc
```

Open a new tab/window in your terminal. Type npm install command to install truffle:

```sh
$ npm i -g truffle
```

Now in the terminal run commands.

```sh
truffle compile
truffle test
```

Which shows the testcases.
