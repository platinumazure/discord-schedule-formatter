import { Guild, GuildScheduledEvent, Collection } from "discord.js";

import { ScheduledEvent } from "../../src/models/scheduledEvent.js";
import { deleteEvent, deleteGuildEvents, insertEvent, updateEvent, upsertGuildEvents }
    from "../../src/services/guildEventService.js";

function createFakeClient() {
    return {
        users: {
            resolve: x => x
        },
        options: {
            makeCache: () => new Collection()
        }
    };
}

describe("GuildEventService", function () {
    describe("insertEvent", function () {
        beforeEach(function () {
            spyOn(ScheduledEvent, "create").and.resolveTo();
        });

        it("should call event create", async function () {
            const scheduledEvent = new GuildScheduledEvent(createFakeClient(), {});

            await insertEvent(scheduledEvent);

            expect(ScheduledEvent.create).toHaveBeenCalled();
            expect(ScheduledEvent.create).toHaveBeenCalledOnceWith(scheduledEvent);
        });
    });

    describe("updateEvent", function () {
        beforeEach(function () {
            spyOn(ScheduledEvent, "update").and.resolveTo();
        });

        it("should call event update", async function () {
            const scheduledEvent = new GuildScheduledEvent(createFakeClient(), { id: 1 });

            await updateEvent(scheduledEvent);

            expect(ScheduledEvent.update).toHaveBeenCalled();
            expect(ScheduledEvent.update).toHaveBeenCalledOnceWith(
                scheduledEvent,
                jasmine.objectContaining({ where: { id: 1 } })
            );
        });
    });

    describe("deleteEvent", function () {
        beforeEach(function () {
            spyOn(ScheduledEvent, "destroy").and.resolveTo();
        });

        it("should call event destroy", async function () {
            const scheduledEvent = new GuildScheduledEvent(createFakeClient(), { id: 1 });

            await deleteEvent(scheduledEvent);

            expect(ScheduledEvent.destroy).toHaveBeenCalled();
            expect(ScheduledEvent.destroy).toHaveBeenCalledOnceWith(
                jasmine.objectContaining({ where: { id: 1 } })
            );
        });
    });

    describe("deleteGuildEvents", function () {
        beforeEach(function () {
            spyOn(ScheduledEvent, "destroy").and.resolveTo();
        });

        it("should call event destroy with guildId", async function () {
            const guild = new Guild(createFakeClient(), { id: 1 });

            await deleteGuildEvents(guild);

            expect(ScheduledEvent.destroy).toHaveBeenCalled();
            expect(ScheduledEvent.destroy).toHaveBeenCalledOnceWith(
                jasmine.objectContaining({ where: { guildId: 1 } })
            );
        });
    });

    describe("upsertGuildEvents", function () {
        beforeEach(function () {
            spyOn(ScheduledEvent, "upsert").and.resolveTo();
        });

        it("should call event upsert with guildId", async function () {
            const events = [
                { id: 1 },
                { id: 2 },
                { id: 3 }
            ];

            const guild = new Guild(createFakeClient(), { id: 1 });
            spyOn(guild, "fetch").and.resolveTo(guild);
            spyOn(guild.scheduledEvents, "fetch").and.resolveTo(events);

            await upsertGuildEvents(guild);

            expect(ScheduledEvent.upsert).toHaveBeenCalledTimes(3);
            expect(ScheduledEvent.upsert.calls.argsFor(0))
                .toEqual([{ id: 1 }]);
            expect(ScheduledEvent.upsert.calls.argsFor(1))
                .toEqual([{ id: 2 }]);
            expect(ScheduledEvent.upsert.calls.argsFor(2))
                .toEqual([{ id: 3 }]);
        });
    });
});
