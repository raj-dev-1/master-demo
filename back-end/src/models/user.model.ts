import path from 'path';
import multer from 'multer';
import db from '../config/sequelize';
import { DataTypes, Model } from 'sequelize';
import Role from './role.model';
import Joi from 'joi';
import { unlinkSync } from 'fs';

interface UserData {
    id: number;
    name: string;
    email: string;
    password: string;
    gender: 'male' | 'female';
    image: string;
    gr_number?: string | null;
    phone: string;
    address: string;
    department?: string | null;
    div?: string | null;
    roleId: number;
}

const imgPath = '/uploads/user';

class User extends Model<UserData> {}

User.init(
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
            validate: {
                len: [3, 15],
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: {
                    msg: 'Please enter a valid email address'
                }
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        gender: {
            type: DataTypes.ENUM("male", "female"),
            allowNull: false,
        },
        image: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        gr_number: {
            type: DataTypes.STRING,
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                len: [10, 10],
            }
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        department: {
            type: DataTypes.STRING,
        },
        div: {
            type: DataTypes.STRING,
        },
        roleId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    },
    {
        sequelize: db,
        modelName: "User",
        indexes: [
            {
                unique: true,
                fields: ["email", "password"]
            },
        ],
    }
);

function validateData(data: Record<string, any>) {
    const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(4).max(8).required(),
        confirmPassword: Joi.string().min(4).max(8).required(),
        gender: Joi.string().valid("male", "female").required(),
        gr_number: Joi.string().allow(null).optional(),
        phone: Joi.string().required(),
        address: Joi.string().required(),
        department: Joi.string().allow(null).optional(),
        div: Joi.string().allow(null).optional(),
    });
    return schema.validate(data);
}

const imageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "..", imgPath))
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});

const deleteFile = async (file: { path?: string }) => {
    try {
      if (file && file.path) {
        await unlinkSync(file.path);
      }
    } catch (error) {
      console.log(error);
    }
  };

const uploadImgPath = multer({ storage: imageStorage }).single("image");
User.belongsTo(Role, { onDelete: "CASCADE", foreignKey: "roleId" });

export { User, uploadImgPath, imgPath, validateData, deleteFile };
