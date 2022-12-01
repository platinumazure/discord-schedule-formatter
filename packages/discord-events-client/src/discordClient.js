import { Client, Events } from "discord.js";
import { GatewayIntentBits } from "discord-api-types/v10";

import { deleteEvent, deleteGuildEvents, insertEvent, updateEvent, upsertGuildEvents }
    from "./services/guildEventService.js";

export class DsfClient extends Client {
    constructor() {
        super({
            intents: [GatewayIntentBits.GuildScheduledEvents, GatewayIntentBits.Guilds]
        });

        this.on(Events.ClientReady, async () => {
            console.log(`Logged in as ${this.user.tag}`);

            this.guilds.fetch()
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

        this.on(Events.GuildScheduledEventCreate, async guildEvent => {
            try {
                await insertEvent(guildEvent);
                console.log(`New event inserted: ${guildEvent.name} (${guildEvent.guild.name})`);
            } catch (error) {
                console.error(`Failed to insert new event ${guildEvent.name}:`, error);
            }
        });

        this.on(Events.GuildScheduledEventUpdate, async guildEvent => {
            try {
                await updateEvent(guildEvent);
                console.log(`Event updated: ${guildEvent.name} (${guildEvent.guild.name})`);
            } catch (error) {
                console.error(`Failed to update event ${guildEvent.name}:`, error);
            }
        });

        this.on(Events.GuildScheduledEventDelete, async guildEvent => {
            try {
                await deleteEvent(guildEvent);
                console.log(`Event deleted: ${guildEvent.name} (${guildEvent.guild.name})`);
            } catch (error) {
                console.error(`Failed to delete event ${guildEvent.name}:`, error);
            }
        });

        this.on(Events.GuildCreate, async guild => {
            // TODO: Extract common logic
            try {
                const resultsArray = await upsertGuildEvents(guild);

                console.log(`Joined ${guild} and loaded ${resultsArray.length} event(s)`);
            } catch (error) {
                console.error(`Could not upsert events for ${guild}:`, error);
            }
        });

        this.on(Events.GuildDelete, async guild => {
            try {
                const numEventsDeleted = await deleteGuildEvents(guild);
                console.log(`Guild deleted: ${guild.name} (${numEventsDeleted} events deleted)`);
            } catch (error) {
                console.error(`Failed to delete events from guild ${guild.name}:`, error);
            }
        });
    }
}
