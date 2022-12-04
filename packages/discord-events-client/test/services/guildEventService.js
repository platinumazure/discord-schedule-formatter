import assert from "node:assert";
import { afterEach, beforeEach, describe, it } from "mocha";
import { Guild, GuildScheduledEvent, Collection } from "discord.js";
import { restore, stub } from "sinon";

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
    afterEach(function () {
        restore();
    });

    describe("insertEvent", function () {
        beforeEach(function () {
            stub(ScheduledEvent, "create").resolves();
        });

        it("should call event create", async function () {
            const scheduledEvent = new GuildScheduledEvent(createFakeClient(), {});

            await insertEvent(scheduledEvent);

            assert.strictEqual(ScheduledEvent.create.calledOnce, true);
            assert.strictEqual(ScheduledEvent.create.calledWithMatch(scheduledEvent), true);
        });
    });

    describe("updateEvent", function () {
        beforeEach(function () {
            stub(ScheduledEvent, "update").resolves();
        });

        it("should call event update", async function () {
            const scheduledEvent = new GuildScheduledEvent(createFakeClient(), { id: 1 });

            await updateEvent(scheduledEvent);

            assert.strictEqual(ScheduledEvent.update.calledOnce, true);
            assert.strictEqual(
                ScheduledEvent.update.calledWithMatch(scheduledEvent, { where: { id: 1 } }),
                true
            );
        });
    });

    describe("deleteEvent", function () {
        beforeEach(function () {
            stub(ScheduledEvent, "destroy").resolves();
        });

        it("should call event destroy", async function () {
            const scheduledEvent = new GuildScheduledEvent(createFakeClient(), { id: 1 });

            await deleteEvent(scheduledEvent);

            assert.strictEqual(ScheduledEvent.destroy.calledOnce, true);
            assert.strictEqual(
                ScheduledEvent.destroy.calledWithMatch({ where: { id: 1 } }),
                true
            );
        });
    });

    describe("deleteGuildEvents", function () {
        beforeEach(function () {
            stub(ScheduledEvent, "destroy").resolves();
        });

        it("should call event destroy with guildId", async function () {
            const guild = new Guild(createFakeClient(), { id: 1 });

            await deleteGuildEvents(guild);

            assert.strictEqual(ScheduledEvent.destroy.calledOnce, true);
            assert.strictEqual(
                ScheduledEvent.destroy.calledWithMatch({ where: { guildId: 1 } }),
                true
            );
        });
    });

    describe("upsertGuildEvents", function () {
        beforeEach(function () {
            stub(ScheduledEvent, "upsert").resolves();
        });

        it("should call event upsert with guildId", async function () {
            const events = [
                { id: 1 },
                { id: 2 },
                { id: 3 }
            ];

            const guild = new Guild(createFakeClient(), { id: 1 });
            stub(guild, "fetch").resolves(guild);
            stub(guild.scheduledEvents, "fetch").resolves(events);

            await upsertGuildEvents(guild);

            assert.strictEqual(ScheduledEvent.upsert.calledThrice, true);
            assert.strictEqual(
                ScheduledEvent.upsert.calledWithMatch({ id: 1 }),
                true
            );
            assert.strictEqual(
                ScheduledEvent.upsert.calledWithMatch({ id: 2 }),
                true
            );
            assert.strictEqual(
                ScheduledEvent.upsert.calledWithMatch({ id: 3 }),
                true
            );
        });
    });
});
