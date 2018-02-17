# :horse: unicorn-runner

[![tinkoff fintech](https://img.shields.io/badge/tinkoff-fintech-ffdc2e.svg)](https://fintech.tinkoff.ru)
[![stepan zhevak](https://img.shields.io/badge/stepan-zhevak-1a8b8e.svg)](https://zhevak.name)

Repository contains the game itself and the editor to create new levels easily and quickly. Both applications have no dependencies. All the code is written from the scratch.

# Installation
To start the game you need to install **yarn** package manager firstly (if you still didn't). Please, visit [the official documentation website](https://yarnpkg.com/lang/en/docs/install) and follow the instructions.

When **yarn** is installed, type the commands below:
```sh
git clone git@github.com:Enet/unicorn-runner.git
cd unicorn-runner
yarn install
```

# Start
### Game
To start the game:
```sh
yarn start:game
```
or just click image below:

<a href="http://unicorn.zhevak.name" target="_blank">
    <img src="https://raw.githubusercontent.com/Enet/unicorn-runner/master/UnicornRunner1.jpg" width="400" height="300" />
</a>

### Editor
To start the editor:
```sh
yarn start:editor
```
or just click image below:

<a href="http://editor.zhevak.name" target="_blank">
    <img src="https://raw.githubusercontent.com/Enet/unicorn-runner/master/UnicornRunner2.jpg" width="400" height="300" />
</a>

### Build
To build final bundles:
```sh
yarn build
```

### Skip
If you want to skip level for some reasons, open developer tools in your browser and type in the console:
```javascript
localStorage.setItem('progress', 3)
```

Good luck and have fun! :frog:

# Contacts
If you have some troubles, bugs or questions how the code works, be free to write me at [enet@protonmail.ch](enet@protonmail.ch). Also if you are looking for front-end software developer, be aware that I'm looking for a job. Check out my portfolio at [https://zhevak.name](https://zhevak.name) :rabbit:
