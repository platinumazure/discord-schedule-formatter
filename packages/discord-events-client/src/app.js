import { Client } from "discord.js";
import { GatewayIntentBits } from "discord-api-types/v10";

import { upsertGuildEvents } from "./services/guildEventService.js";

// Connect to database
import { sequelize } from "./util/dbConnection.js";

(async () => {
    try {
        await sequelize.authenticate();
        console.log("Connected successfully to the database.");

        sequelize.sync();
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
})();

const client = new Client({
    intents: [GatewayIntentBits.GuildScheduledEvents, GatewayIntentBits.Guilds]
});

client.on("ready", async () => {
    console.log(`Logged in as ${client.user.tag}!`);

    client.guilds.fetch()
        .then(guilds => {
            guilds.forEach(async guild => {
                try {
                    const resultsArray = await upsertGuildEvents(guild);

                    console.log(`${guild}: Successfully loaded ${resultsArray.length} event(s)`);
                } catch (error) {
                    console.error(`Could not upsert events for ${guild}:`, error);
                }
            });
        })
        .catch(err => console.log(`Could not retrieve guilds: ${err}`));
});

client.login(); // Uses process.env.DISCORD_TOKEN
