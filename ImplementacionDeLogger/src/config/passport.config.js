import passport from "passport";
import jwt from "passport-jwt";
import { SECRET_JWT } from "./config.js";
import { cookieExtractor } from "../utils/jwt.js";

const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const initializePassport = () => {
  passport.use( "jwt", new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: SECRET_JWT,
      },
        async (jwt_payload, done) => {
          try {
            return done(null, jwt_payload);
          } catch (err) {
            return done(err);
          }
        }
      )
    );
};
export default initializePassport;