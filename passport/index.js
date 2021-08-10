const passport = require('passport');
const local = require('./local');
const jwt = require('./jwt');
const { Account } =require('../models');

module.exports = () => {
    passport.serializeUser((account, done) => {
        done(null, account.id);
    });
    passport.deserializeUser(async  (id, done) => {
        try{
            const user = await Account.findOne({where: { id}});
            done(null, user);
        }catch (error){
            console.error(error);
            done(error);
        }
    })
    local();
    jwt();
}
