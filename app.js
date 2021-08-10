const express = require('express');
const db = require('./models/index');
const dotenv = require('dotenv');
const app = express();

const accountRouter = require('./routes/account');

dotenv.config();

db.sequelize.sync().then(() => {
        console.log("Database Connected");
    }).catch(err => {
        console.log(("Error"));
        console.log(err);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', accountRouter);

app.listen(3065, () => {
    console.log("3065 Port Opened")
});