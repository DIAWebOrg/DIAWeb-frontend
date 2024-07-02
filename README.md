<a name="top"></a>

# DIAWeb backend

![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=flat-square&logo=angular&logoColor=white)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=DIAWebOrg_DIAWeb-frontend&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=DIAWebOrg_DIAWeb-frontend)
[![Run Tests](https://github.com/DIAWebOrg/DIAWeb-frontend/actions/workflows/tests.yaml/badge.svg)](https://github.com/DIAWebOrg/DIAWeb-frontend/actions/workflows/tests.yaml)
![MIT License](https://img.shields.io/badge/License-MIT-yellow.svg)
![Status](https://img.shields.io/badge/status-alpha-orange)

<details>  
<summary><b>Table of contents</b></summary>
  
1. [Introduction](#introduction)
2. [Project structure](#project-structure)
3. [Installing Dependencies](#installing-dependencies)
4. [Running the Project](#running-the-project)
5. [Contact data](#contact-data)
6. [License](LICENSE.md)
</details>

## Introduction

DIAWeb is a web application that allows the user to calculate their risk of suffering diabetes, based on an artificial intelligence powered model. This project is the frontend of it, i.e., the GUI that allows the user to compute such risk based on a range of biochemical markers.

## Project structure

- `.github/`: Contains dependabot configuration along with workflow file
- `public/`: Contains media assets
- `src/`: Main folder that contains the source code
  - `app/`: The core of the application where all Angular components, services, and models are
    - `app.component.html`: Template for main component
    - `app.component.scss`: Styles for main component
    - `app.component.spec.ts`: Unit tests for main component
    - `app.component.ts`: Main component TypeScript logic
    - `app.config.ts`: Main component configuration
    - `app.routes.ts`: Routing specification
  - `index.html`: The main HTML file that is the entry point for the web application
  - `main.ts`: The main entry point for the Angular application
  - `styles.scss`: Global styles for the application
- `angular.json`: Angular configuration
- `package-lock.json`: Automatically generated file that locks the versions of the project's dependencies.
- `package.json`: Contains metadata about the project and its dependencies.
- `tailwind.config.js`: Configuration file for Tailwind CSS.
- `tsconfig.app.json`: TypeScript configuration specific to the Angular application.
- `tsconfig.json`: Base TypeScript configuration file.
- `tsconfig.spec.json`: TypeScript configuration for unit tests.
- `.gitignore`: Folders not to include in the repository
- `LICENSE.md`: MIT license of the project
- `CODE_OF_CONDUCT.md`: Behavioural guidelines for contributors
- `README.md`: A briefing of the project and how to run it
- `SECURITY.md`: Briefing of the security policy
- `requirements.txt`: List of Python dependencies of the project

## Installing Dependencies

You can install the project's dependencies specified in the `package.json` file. Run the following command:

```bash
pnpm install
```

This will install all the necessary packages for this project.

## Running the Project

To run the project, run

```bash
pnpm run start
```

## Contact data

If you have any request or inquiry, feel free to contact me at [pabcabmar3@alum.us.es](mailto:pabcabmar3@alum.us.es)

<a href="#top">Back to Top</a>
