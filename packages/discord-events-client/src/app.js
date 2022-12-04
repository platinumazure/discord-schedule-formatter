import { DsfClient } from "./discordClient.js";

// Connect to database
import { getDBConnection } from "./util/dbConnection.js";

(async () => {
    const sequelize = await getDBConnection();

    try {
        await sequelize.authenticate();
        console.log("Connected successfully to the database.");

        sequelize.sync();
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
})();

const client = new DsfClient();

client.login(); // Uses process.env.DISCORD_TOKEN
