# LAN Bet Bot
Bot for collecting and summing up bets on games played during LAN party. For now there are few basic commands:

* `create-team` - add team with name a and logo
* `create-game` - add game with teams and 'bet stake'
* `delete-team` - remove the team
* `open-game` - create discord embed with buttons used for betting and closing bets
* `set-winner` - command used to tell the bot who won the game
* `summary` - command displays results of bettng on a specified game

## TODO
* ~~Write primitive prototype~~
* ~~Restructure project, use the discord.js guidelines~~
* Refactor commands and components to utilize autocompletion for better UX, make components more reusable
* Integrate [knex](https://knexjs.org/) to the project migrate to PostgreSQL using knex migrations, refactor repositories to use knex clean sql builder syntax instead of shi**ty string manipulation
* Add command `delete-game`
* Add support for displaying members of the team
* Make bet courses dynamic

## Tech details
For project uses:

* [discord.js](https://discord.js.org/) for accessing discord api
* [sqlite3](https://www.sqlite.org/index.html) for Database
* [bun](https://bun.sh/) for compiling TS, js runtime and package manager

### Setup
Requires [bun](https://bun.sh/) to be installed

In the project root run
```bash
bun install
```

### Run
For now can be run in 'development mode'

provide 3 environmental variables:
```.env
BOT_TOKEN=<YOU SECRET BOT TOKEN>
CLIENT_ID=<YOUR BOT CLIENT ID>
GUILD_ID=<ID OF YOUR DISCORD SERVER USED FOR TESTING>
```

Deploy commands to the discord server
```bash
bun run dev:deploy
```

then you start the bot
```bash
bun start
```

## Screenshots
