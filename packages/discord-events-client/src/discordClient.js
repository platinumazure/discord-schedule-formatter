import { Client } from "discord.js";
import { GatewayIntentBits } from "discord-api-types/v10";

const client = new Client({ intents: [GatewayIntentBits.GuildScheduledEvents] });

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.login(); // Uses process.env.DISCORD_TOKEN
