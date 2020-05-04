# FIIT BP Canaries - Front-end

This repository holds source codes for the front-end portion of the Leak-detection system

## Authors

-   Dominik Dancs - dodancs@moow.info, https://dodancs.moow.info/

## Requirements

- Windows or Linux operating system
- [NodeJS](https://nodejs.org/en/)

## Dependencies

- [VueJS](https://vuejs.org/)
- [vue-router](https://router.vuejs.org/)
- [Vuetify](https://vuetifyjs.com/en/)
- [Vuex](https://vuex.vuejs.org/)
- [Axios](https://github.com/axios/axios)
- [material-design-icons-iconfont](https://www.npmjs.com/package/material-design-icons-iconfont)

## Prerequisites

Before we can proceed with developing or deploying the project, VueJS's vue-cli package needs to be installed with the NodeJS package manager:

```bash
~$ npm install -g @vue/cli
```

The vue-cli is a command-line tool for VueJS which is the framework used to implement this project.

## Development

To continue working on this project, first download the source code from the GitHub repository:

```bash
~$ git clone git@github.com:dodancs/FIIT-BP-Canaries-Frontend.git
```

When the code is downloaded, go into that folder and install all of the dependencies by doing the following command:

```bash
~$ cd ./FIIT-BP-Canaries-Frontend/
~/FIIT-BP-Canaries-Frontend/$ npm install
```

Open the project folder in your favourite editor of choice. My choice was to go with Visual Studio Code due to its wide range of plugins. If you choose Visual Studio Code, install the Vetur plugin which will add better syntax highlighting and autocomplete features.

The basic structure of the project is described below:

- `/src` - The source code folder - here lie all of the components of the project.
- `/src/assets` - Folder to store any static assets of the project - like pictures and other media.
- `/src/components` - Visual components of the individual pages - you should create components in individual files to be able to re-use them on different pages.
- `/src/plugins` - VueJS plugins folder - here is the configuration for the Vuetify package.
- `/src/router` - Page router configuration - in the router `index.js` file are defined routes in the app. A route is basically a sub-part of the URL. For example, if you want a login page to be `https://myapp/login`, you define the `/login` route here and tell it to render the LoginPage.
- `/src/store` - Data store configuration - here you may specify what data is stored, how to access it and how to modify it.
- `/src/views` - Page views - this directory holds all of the pages that will be displayed. Each page is defined in it's own file.
- `/src/App.vue` - The main view file - this file is the root view of everything displayed. Here, we defined how the app should be laid out and implemented the vue-router.
- `/src/config.js` - Configuration of the app - here we specified the URL of the back-end API.
- `/src/main.js` -  The main "executable" script - this is where the application is created and with it all of the dependencies. The Vuetify visual framework is also specified to be used here.
- `/vue.config.js` - This configuration file specifies special dependencies and also sets the public directory path. This is useful when you want to deploy the application in a subfolder.

To learn more about the structure and how the framework works, please take a look at VueJS's documentation.

## Deployment to production

Repeat the steps from the Development section to clone the repository and install all dependencies. To create the code ready for deployment first check the `/src/config.js` to set the back-end API URL. Then, check the `/vue.config.js` file to specify the root URL of the public directory.

To compile the source codes into production-ready code, run the following command:

```bash
~$ npm run build
```

The compiled code should be then located in the `/dist` directory. Copy these files to the desired location. The main file of this application is the `index.html`.