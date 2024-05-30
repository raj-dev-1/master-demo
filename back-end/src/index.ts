import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import "./models/index";
import indexRoutes from "./routes/index";
import hodRoutes from "./routes/hod.routes";
import adminRoutes from "./routes/admin.routes";
import path from "path";
import passport from "passport";
import session from "express-session";
import { PORT, SECRET_KEY, } from "./config/constant";
import "./config/googleStrategy";
import cors from "cors";
// import { allowedOrigins } from "./config/app.constants";
const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.set("views", path.join(__dirname, "views"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(
  session({
    name: "leaveManagement",
    secret: SECRET_KEY,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

app.get("/", (req: Request, res: Response) => {
  return res.status(200).json({
    message: "hello NEXT JS",
  });
});

// export const corsOptionsDelegate = async (req, callback) => {
//   const grant =
//     allowedOrigins[NODE_ENV].indexOf(req.header("Origin")) !== -1;
//   return grant
//     ? callback(undefined, { origin: true })
//     : callback('tst');
// };

app.use("/", indexRoutes);
app.use("/hod", hodRoutes);
app.use("/admin", adminRoutes);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
