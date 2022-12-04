import { ScheduledEvent } from "../models/scheduledEvent.js";

// Workaround for sequelize limitation around class instances
// https://github.com/sequelize/sequelize/issues/15337
function toPlainObject(djsEvent) {
    const attrs = ScheduledEvent.getAttributes();

    if (attrs) {
        return Object.keys(ScheduledEvent.getAttributes()).reduce(
            (obj, key) => {
                if (key in djsEvent) {
                    obj[key] = djsEvent[key];
                }
                return obj;
            },
            {}
        );
    } else {
        return djsEvent;
    }
}

export async function upsertGuildEvents(guild) {
    const hydratedGuild = await guild.fetch();
    const events = await hydratedGuild.scheduledEvents.fetch();

    return Promise.all(
        events.map(
            guildEvent => ScheduledEvent.upsert(toPlainObject(guildEvent))
        )
    );
}

export async function insertEvent(guildEvent) {
    return ScheduledEvent.create(toPlainObject(guildEvent));
}

export async function updateEvent(guildEvent) {
    return ScheduledEvent.update(toPlainObject(guildEvent), {
        where: { id: guildEvent.id }
    });
}

export async function deleteEvent(guildEvent) {
    return ScheduledEvent.destroy({ where: { id: guildEvent.id } });
}

export async function deleteGuildEvents(guild) {
    return ScheduledEvent.destroy({ where: { guildId: guild.id } });
}
