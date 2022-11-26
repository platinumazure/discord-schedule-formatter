import Sequelize from "sequelize";

export const sequelize = new Sequelize(process.env.DB_CONNECTION_STRING, {
    logging: false
});
