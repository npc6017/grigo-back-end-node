const express = require('express')
const router = express.Router();
const { Account } = require('../models');
const bcrypt = require('bcrypt');

/** Post
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
        console.log(error);
        next(error);
    }
});

module.exports = router;