const passport = require('passport');
const local = require('./local');
const jwt = require('./jwt');
const { Account } =require('../models');

module.exports = () => {
    local();
    jwt();
}
