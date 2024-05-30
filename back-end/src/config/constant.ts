import dotenv from "dotenv";

dotenv.config();

const PORT: number = parseInt(process.env.PORT!);
const DBNAME: string = process.env.DBNAME!;
const USER_NAME: string = process.env.USER_NAME!;
const PASSWORD: string = process.env.PASSWORD!;
const HOST: string = process.env.HOST!;
const SECRET_KEY: string = process.env.SECRET_KEY!;
const CLIENTID: string = process.env.CLIENTID!;
const CLIENT_SECRET: string = process.env.CLIENT_SECRET!;
const EMAIL_PASWORD: string = process.env.EMAIL_PASWORD!;
const EMAIL_FROM: string = process.env.EMAIL_FROM!;
const NODE_ENV: string = process.env.NODE_ENV;

export {
  PORT,
  DBNAME,
  USER_NAME,
  PASSWORD,
  SECRET_KEY,
  HOST,
  CLIENTID,
  CLIENT_SECRET,
  EMAIL_PASWORD,
  EMAIL_FROM,
  NODE_ENV,
};
