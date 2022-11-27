import { DataTypes, Model } from "sequelize";
import { sequelize } from "../util/dbConnection.js";

export class ScheduledEvent extends Model {}

ScheduledEvent.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },

    channelId: DataTypes.STRING,

    creatorId: DataTypes.STRING,

    description: DataTypes.STRING,

    guildId: {
        type: DataTypes.STRING,
        allowNull: false
    },

    id: {
        type: DataTypes.STRING,
        primaryKey: true
    },

    scheduledStartAt: DataTypes.DATE,

    scheduledEndAt: DataTypes.DATE,

    url: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isUrl: true
        }
    }
}, { sequelize });
