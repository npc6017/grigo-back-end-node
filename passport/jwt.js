const passport = require('passport');
const dotenv = require('dotenv');
const { ExtractJwt,Strategy: JWTStrategy } = require('passport-jwt');
const { Account } = require('../models');

dotenv.config();

module.exports = () => {
    passport.use(new JWTStrategy({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.SECRET,
    }, async (jwtPayload, done) => {
        try{
            const account = await Account.findOne({
                where: { email: jwtPayload.email},
                // password 제외
                attributes: {
                    exclude: ['password'],
                }
            });
            if(!account) {
                return done(null, false, { reason: '올바르지 않은 인증 상태입니다.' });
            }
            return done(null, account);
        }catch (error){
            console.error(error);
            return done(error);
        }
    }));
}