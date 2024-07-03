import { DataTypes, Model, Optional } from "sequelize";
import db from "../config/sequelize";
import { User } from "./user.model";
import Role from "./role.model";

// Define an interface for the required attributes
interface OtpAttributes {
  id: number;
  email: string;
  otp: number;
  userId: number;
  roleId: number;
  createdAt?: Date;
}

// Define an interface for the optional attributes
interface OtpCreationAttributes extends Optional<OtpAttributes, 'id'> {}

// Define the model
class Otp extends Model<OtpAttributes, OtpCreationAttributes> implements OtpAttributes {
  public id!: number;
  public email!: string;
  public otp!: number;
  public userId!: number;
  public roleId!: number;
  public createdAt?: Date;
}

// Initialize the model
Otp.init(
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
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: "Please enter a valid email address",
        },
      },
    },
    otp: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    modelName: "Otp",
    timestamps: false,
  }
);
Otp.belongsTo(User, { onDelete: "CASCADE", foreignKey: "userId" });
Otp.belongsTo(Role, { onDelete: "CASCADE", foreignKey: "roleId" });

export default Otp;
