import { Sequelize } from "sequelize";
import { DBNAME, USER_NAME, PASSWORD, HOST } from "./constant";

const db = new Sequelize(DBNAME, USER_NAME, PASSWORD, {
  host: HOST,
  dialect: 'mysql',
  logging: false,
});

db.authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err: any) => {
    console.error("Unable to connect to the database:", err);
  });

export default db;
