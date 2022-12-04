import Sequelize from "sequelize";

let realSequelize, mockSequelize;

export async function getDBConnection() {
    if (!mockSequelize && process.env.NODE_ENV === "test") {
        try {
            /* eslint-disable-next-line node/no-unsupported-features/es-syntax, node/no-unpublished-import --
             * Dynamic import is supported since Node 13+, so the es-syntax message is
             *   a false error.
             * We are handling a failed import with the catch block.
             */
            const SequelizeMock = await import("sequelize-mock");

            mockSequelize = new SequelizeMock();
        } catch {
            // do nothing
        }
    }

    if (mockSequelize) {
        return mockSequelize;
    } else {
        if (!realSequelize) {
            realSequelize = new Sequelize(process.env.DB_CONNECTION_STRING, {
                logging: false
            });
        }

        return realSequelize;
    }
}
