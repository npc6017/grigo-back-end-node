const express = require('express');
const db = require('./models/index');
const dotenv = require('dotenv');
const passport = require('passport');
const passportConfig = require('./passport');
const app = express();

const accountRouter = require('./routes/account');
const tagRouter = require('./routes/tag');

dotenv.config();

db.sequelize.sync().then(() => {
        console.log("Database Connected");
    }).catch(err => {
        console.log(("Error"));
        console.log(err);
});

app.use(passport.initialize());
passportConfig();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', accountRouter);
app.use('/tag', tagRouter);

app.listen(3065, () => {
    console.log("3065 Port Opened")
});