# discord-events-client

discord-events-client is a simple Discord bot that reads Scheduled Events from
Discord guilds. It works with other parts of discord-schedule-formatter to allow user
to embed Discord event information in web overlays.

## Local Setup

1. Clone the main repository
1. Run `npm install`
1. Copy the `.env_example` file to create an `.env` file. Fill in the missing secrets
    (reach out to platinumazure if you need help).
1. Run `npm start` from this directory.

Run unit tests with `npm test`. (Also handled in pre-commit hooks.)
