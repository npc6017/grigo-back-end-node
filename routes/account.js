const express = require('express')
const router = express.Router();
const { Account } = require('../models');
const passport = require('passport');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config();

/** Create Json Wen Token, Method */
const createJWT = (email) => {
    return jwt.sign({
        email: email,
        role: "user"
    }, process.env.SECRET, {
        subject: process.env.USER,
        expiresIn: process.env.TIME,
        issuer: process.env.USER,
    });
}

/** Login, Post
 * Context-type : application/json
 * */
router.post('/login', async (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if(err) {
            console.log(err);
            return next(err);
        }
        if(info) {
            return res.status(401).send(info.reason);
        }
        return req.login(user, async (loginErr) => {
            if(loginErr) {
                console.error((loginErr));
            }
            const accountWithOutPw = await Account.findOne({
                where: { id: user.id},
                attributes:{
                    exclude: ['password'],
                },
            });
            // TODO Tag 가져오는 코드 작성

            // JWT 생성
            const token = createJWT(accountWithOutPw.email);
            res.setHeader("Authorization",`Bearer ${token}`);
            return res.status(200).json(accountWithOutPw);
        })
    })(req, res, next);
});

/** Join, Post
 * Context-type : application/json
 * */
router.post('/join', async (req, res, next) => {
    try {
        /** 이메일 중복 체크 */
        const exEmail = await Account.findOne({
            where: { email: req.body.email },
        })
        if(exEmail){
            return res.json({status: 404, errorMessage: "이미 사용중인 이메일입니다."});
        }
        /** 학번 중복 체크 */
        const exStuNum = await Account.findOne({
            where: { studentId: req.body.studentId },
        })
        if(exStuNum){
            return res.json({status: 404, errorMessage: "이미 가입되어 있는 학번입니다."});
        }

        // Password Encoder Bcrypt
        const hashPW = await bcrypt.hash(req.body.password, 12);
        await Account.create({
            email: req.body.email,
            password: hashPW,
            name: req.body.name,
            birth: req.body.birth,
            studentId: req.body.studentId, // studentId -> student_Id
            sex: req.body.sex,
            phone: req.body.phone,
        });

        res.json({status: 201, errorMessage: "Success"});

    }catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;