const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const bcrypt = require('bcrypt');
const { Account } = require('../models');

module.exports = () => {
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
    }, async (email, password, done) => {
        try {
            const account = await Account.findOne({
                where: { email: email }
            });
            // Account가 존재하지 않거나, 비밀번호가 틀린 경우.
            if(!account) {
                return done(null, false, { reason: '이메일 또는 비밀번호가 틀립니다.' });
            }
            /// 비밀번호 전처리, ({bcrypt}제거)

            // 비밀번호 검증
            const result = await bcrypt.compare(password, account.password.substr(8));/// account.password.substr(8) => {bcrypt} 제거
            // 비밀번호 검증에 실패한 경우
            if(!result) {
                return done(null, false, { reason: '이메일 또는 비밀번호가 틀립니다.' });
            }
            return done(null, account);
        }catch (error) {
            console.error(error);
            return done(error);
        }

    }));
}