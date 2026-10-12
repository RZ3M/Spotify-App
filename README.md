# Spoticlone

An Angular 22 application using Angular Material and the Angular application build system.

Click here for a demo: https://spotify-app-bay.vercel.app/

Sample Account:
Username: `1`
Password: `1`

## Setup

Use Node.js 24.15.0 (`nvm use`, if you use nvm) and npm 10 or newer.
Angular also supports Node.js 22.22.3+ in the 22.x series and Node.js 26+.

Run `npm ci` to install the versions recorded in `package-lock.json`.

## Development server

Run `npm start` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `npm run build` to create a production build. The static files are stored directly in `dist/spoticlone/`, preserving the deployment output directory.

## Running unit tests

Run `npm test` to execute the regression tests using Vitest and jsdom. Use `npm run test:ci` for a single run. The tests exercise login, guarded routes, Material views with sample music data, and HTTP authorization. They use mocked APIs and do not require Spotify credentials or a live backend.

## Dependency security

Run `npm run audit` to check all production and development dependencies. CI performs a clean install, build, regression tests, and this audit on pushes and pull requests.

Flex Layout has been replaced with responsive CSS. The old Webpack/Karma toolchain has been replaced with the Angular application builder and Vitest. Dependency upgrades should keep Angular framework packages on the same version and Material/CDK on the same version, using the [Angular compatibility table](https://angular.dev/reference/versions) to select Node.js and TypeScript versions.

## Further help

To get more help on the Angular CLI use `npm run ng -- help` or see the [Angular CLI reference](https://angular.dev/tools/cli).
