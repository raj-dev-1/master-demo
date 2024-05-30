import { DataTypes, Model } from "sequelize";
import db from "../config/sequelize";

interface RoleAttributes {
    id: number;
    name: string;
    priority: number;
}

class Role extends Model<RoleAttributes> {}

Role.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        priority: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    },
    {
        sequelize: db,
        modelName: "Role",
        timestamps: false
    }
);

export default Role;
