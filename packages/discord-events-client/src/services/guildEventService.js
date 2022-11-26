import { ScheduledEvent } from "../models/scheduledEvent.js";

export async function upsertGuildEvents(guild) {
    const hydratedGuild = await guild.fetch();
    const events = await hydratedGuild.scheduledEvents.fetch();

    // TODO: Open issue with sequelize about url non-enumerable
    return Promise.all(events.map(guildEvent => ScheduledEvent.upsert({
        ...guildEvent,
        eventUrl: guildEvent.url
    })));
}
