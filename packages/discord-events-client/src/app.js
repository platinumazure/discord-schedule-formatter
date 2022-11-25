import { Client } from "discord.js";
import { GatewayIntentBits } from "discord-api-types/v10";

const client = new Client({
    intents: [GatewayIntentBits.GuildScheduledEvents, GatewayIntentBits.Guilds]
});

client.on("ready", async () => {
    console.log(`Logged in as ${client.user.tag}!`);

    client.guilds.fetch()
        .then(guilds => {
            guilds.forEach(guild => {
                guild.fetch()
                    .then(g => g.scheduledEvents.fetch()
                        .then(events => {
                            console.log(`${guild}: ${events.size} event(s) found`);
                            events.forEach(e => {
                                console.log(`\t- ${e.name} (${e.scheduledStartAt})`);
                            });
                        })
                        .catch(err => console.log(`${guild}: Could not retrieve events: ${err}`)))
                    .catch(err => console.log(`${guild}: Could not hydrate guild: ${err}`));
            });
        })
        .catch(err => console.log(`Could not retrieve guilds: ${err}`));
});

client.login(); // Uses process.env.DISCORD_TOKEN
