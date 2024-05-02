import passport from 'passport';
import User from '../models/user';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.ACCESS_TOKEN_SECRET,
};

passport.use(new JwtStrategy(jwtOptions, async (payload, done) => {
    const user = await User.findById(payload.userId)
        .catch((err) => done(err, false));

    if (user) return done(null, user);
    else return done(null, false);
}));
