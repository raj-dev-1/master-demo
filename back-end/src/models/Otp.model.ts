import { DataTypes, Model } from "sequelize";
import db from "../config/sequelize";

interface OtpAttributes {
  id: number;
  email: string;
  otp: number;
  createdAt?: any;
}

class Otp extends Model<OtpAttributes> {}

Otp.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
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
}, {
  sequelize: db,
  modelName: 'Otp',
  timestamps: false,
});

export default Otp;
