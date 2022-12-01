import { DsfClient } from "./discordClient.js";

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

const client = new DsfClient();

client.login(); // Uses process.env.DISCORD_TOKEN
