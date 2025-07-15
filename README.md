# Go Tool

A generic Go project template, meant to be used as a starting point for new projects.

## Pre-requisites

```sh
go install golang.org/x/tools/cmd/gonew@latest
```

## Start your new project

1. Create a new project using `gonew`:

```sh
GOPRIVATE=github.com/mayainfo gonew github.com/mayainfo/gotool github.com/mayainfo/<PROJECT_NAME>
```

Using lowercase & hyphen-separated names is recommended for the project name, e.g. `my-project`.

2. Initialize the project:

```sh
cd <PROJECT_NAME> && make tidy && git init && git add . && git commit -m "initial commit"
```

Happy coding!

## Backend guide

### Install dependencies / packages

Install project dependencies & git hooks.

```sh
make dev-brew
```

Install Go tools, including formatting, linting, and testing tools.

```sh
make dev-gotooling
```

### Setup the environment

```sh
cp .env.example .env
```

Now you can start all the services by running:

```sh
make dev-up
```

To stop and remove the containers, run:

```sh
make dev-down
```

### Development with hot reload

```sh
air
```

### Run the tests

```sh
make test
```

## Frontend support

### Pre-requisites

- Install Node.js
- Install pnpm
- Install Nx CLI

### Install git hooks

```sh
make dev-brew
```

### Install dependencies

```sh
pnpm install
```

### Create a new app

```sh
pnpm exec nx g @app/plugin:app <app-name>
```

Your app will be created in the `web/apps/<app-name>` directory.
To start the app, run:

```sh
pnpm exec nx serve <app-name>
```

Or you can add below script to `package.json`:

```json
"scripts": {
"start:<app-name>": "pnpm exec nx serve <app-name>"
}
```

Then you can run:

```sh
pnpm run start:<app-name>
```

To add material UI support, you can run:

```sh
pnpm exec nx g @angular/material:ng-add --project <app-name>
```

### Create a new library

```sh
pnpm exec nx g @app/plugin:library <lib-name>
```

### Create a new component

```sh
pnpm exec nx g @app/plugin:component <component-name>
```

### Create a new dialog

```sh
pnpm exec nx g @app/plugin:dialog <dialog-name>
```