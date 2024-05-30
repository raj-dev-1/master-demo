import dotenv from 'dotenv';
import passport from 'passport';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import { User } from '../models/user.model';
import bcrypt from 'bcryptjs';
import { role } from './variables';
import { CLIENT_SECRET, CLIENTID } from './constant';

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: CLIENTID,
      clientSecret: CLIENT_SECRET,
      callbackURL: "/google/callback",
    },
    async function (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      cb: (error: any, user?: any) => void
    ) {
      try {
        const email = profile.emails && profile.emails[0]?.value;
        if (!email) {
          return cb(new Error("No email found"));
        }

        const checkEmail = await User.findOne({
          where: { email },
        });

        if (checkEmail) {
          return cb(null, checkEmail);
        } else {
          const pass = `${email}@123`;

          const userDetails : any = {
            name: profile.displayName,
            email,
            gender: "male",
            image: profile.photos && profile.photos[0]?.value,
            phone: null,
            address: "India",
            password: await bcrypt.hash(pass, 10),
            roleId: role.student,
          };

          const userData = await User.create(userDetails);

          if (userData) {
            return cb(null, userData);
          } else {
            return cb(null, false);
          }
        }
      } catch (error) {
        console.error(error);
        return cb(error);
      }
    }
  )
);

export default GoogleStrategy;
