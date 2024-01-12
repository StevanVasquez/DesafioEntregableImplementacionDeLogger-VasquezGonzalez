import passport from "passport";

export const authorize = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        return res
          .status(401)
          .json({ message: info.messages ? info.message : String(info) });
      }
      req.user = user;
      next();
    })(req, res, next);
  };
};