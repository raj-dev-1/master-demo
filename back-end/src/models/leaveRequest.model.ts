import { DataTypes, Model, Optional } from "sequelize";
import { User } from "./user.model";
import db from "../config/sequelize";
import { UserLeave } from "./userLeave.model";
// import { UserLeave } from "./userLeave.model";

interface LeaveRequestAttributes {
  id: number;
  userId: number;
  startDate: Date;
  endDate: Date;
  requestToId: number;
  leaveType: "First half" | "Second half" | "Full day";
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
  roleId: number;
}

interface LeaveRequestCreationAttributes extends Optional<LeaveRequestAttributes, "id"> {}

class LeaveRequest extends Model<LeaveRequestAttributes, LeaveRequestCreationAttributes> implements LeaveRequestAttributes {
  public id!: number;
  public userId!: number;
  public startDate!: Date;
  public endDate!: Date;
  public requestToId!: number;
  public leaveType!: "First half" | "Second half" | "Full day";
  public reason!: string;
  public status!: "Pending" | "Approved" | "Rejected";
  public roleId!: number;

  // public readonly createdAt!: Date;
  // public readonly updatedAt!: Date;
}

LeaveRequest.init(
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
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    requestToId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    leaveType: {
      type: DataTypes.ENUM("First half", "Second half", "Full day"),
      allowNull: false,
    },
    reason: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("Pending", "Approved", "Rejected"),
      defaultValue: "Pending",
      allowNull: false,
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    modelName: "LeaveRequest",
  }
);

LeaveRequest.belongsTo(User, {
  onDelete: "CASCADE",
  foreignKey: "userId",
  as: "requestedBy",
});

LeaveRequest.belongsTo(User, {
  onDelete: "CASCADE",
  foreignKey: "requestToId",
  as: "requestedTo",
});


// LeaveRequest.belongsTo(UserLeave, { foreignKey: 'userId' }); 

LeaveRequest.belongsTo(UserLeave, {
  onDelete: "CASCADE",
  foreignKey: "userId",
  targetKey: "userId",
});

export { LeaveRequest };
