import { Client } from "discord.js";
import { GatewayIntentBits } from "discord-api-types/v10";

import { deleteEvent, deleteGuildEvents, insertEvent, updateEvent, upsertGuildEvents }
    from "./services/guildEventService.js";

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

client.on("guildScheduledEventCreate", async guildEvent => {
    try {
        await insertEvent(guildEvent);
        console.log(`New event inserted: ${guildEvent.name} (${guildEvent.guild.name})`);
    } catch (error) {
        console.error(`Failed to insert new event ${guildEvent.name}:`, error);
    }
});

client.on("guildScheduledEventUpdate", async guildEvent => {
    try {
        await updateEvent(guildEvent);
        console.log(`Event updated: ${guildEvent.name} (${guildEvent.guild.name})`);
    } catch (error) {
        console.error(`Failed to update event ${guildEvent.name}:`, error);
    }
});

client.on("guildScheduledEventDelete", async guildEvent => {
    try {
        await deleteEvent(guildEvent);
        console.log(`Event deleted: ${guildEvent.name} (${guildEvent.guild.name})`);
    } catch (error) {
        console.error(`Failed to delete event ${guildEvent.name}:`, error);
    }
});

client.on("guildCreate", async guild => {
    // TODO: Extract common logic
    try {
        const resultsArray = await upsertGuildEvents(guild);

        console.log(`Joined ${guild} and loaded ${resultsArray.length} event(s)`);
    } catch (error) {
        console.error(`Could not upsert events for ${guild}:`, error);
    }
});

client.on("guildDelete", async guild => {
    try {
        const numEventsDeleted = await deleteGuildEvents(guild);
        console.log(`Guild deleted: ${guild.name} (${numEventsDeleted} events deleted)`);
    } catch (error) {
        console.error(`Failed to delete events from guild ${guild.name}:`, error);
    }
});

client.login(); // Uses process.env.DISCORD_TOKEN
