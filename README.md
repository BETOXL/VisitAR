# VisitAr PWA

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) Angular CLI: 13.1.1
Node: 16.13.1
Package Manager: npm 8.1.2
OS: linux x64

<p align="center"><img src="https://github.com/BETOXL/VisitAR/blob/main/src/assets/images/"></p>

## Install

Run `npm install` for a dev server.

## Development server

Run `ionic serve` or `ng serve`  for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ionic build` or  `ng build` to build the project. The build artifacts will be stored in the `www/` or `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [BETOXL](https://BETOXL.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Deploy

ng deploy --base-href=/VisitAR/

# chrome://inspect
# sudo adb start-server

## Input type for questions

1. Text
2. Number
3. Combo
4. Check
5. Date
6. Bool

## Conditional

Works only for `Check` and `Combo` types
Format:

{{IdPregunta}}=='StringRespuesta'
Example:

{{1258}}=='OTROS (Especificar)'
