import { DataTypes, Model } from "sequelize";
import { User } from "./user.model";
import db from "../config/sequelize";

interface UserLeaveAttributes {
  id: number;
  userId: number;
  totalLeave: number;
  availableLeave: number;
  usedLeave: number;
  academicYear: string;
  totalWorkingDays: number;
  attendancePercentage: number;
}

class UserLeave extends Model<UserLeaveAttributes> {}

UserLeave.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    totalLeave: {
      type: DataTypes.DECIMAL(4, 2),
      allowNull: false,
    },
    availableLeave: {
      type: DataTypes.DECIMAL(4, 2),
      allowNull: false,
    },
    usedLeave: {
      type: DataTypes.DECIMAL(4, 2),
      allowNull: false,
    },
    academicYear: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    totalWorkingDays: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
    },
    attendancePercentage: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
    },
  },
  {
    sequelize: db,
    modelName: "UserLeave",
  }
);

UserLeave.belongsTo(User, { onDelete: "CASCADE", foreignKey: "userId" });

export {UserLeave};
