const express = require('express')
const router = express.Router();
const { Account, Notification, Post, AccountTag, Tag } = require('../models');
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

/** Profile, Get */
router.get('/profile', passport.authenticate("jwt", {session: false}), async (req, res, next) => {
    try{
        const account = await Account.findOne({
            where: { id : req.user.id},
            include: [{
                model: AccountTag,
                include: [Tag]
            }],
            attributes: { exclude: ['id', 'password', 'checkNotice', 'createdAt', 'updatedAt']}
        });
        if(!account)
            return res.status(400).send('잘못된 접근입니다.');

        // Tag Obj -> str[]
        const stringTag = account.AccountTags.map((accountTag) =>  accountTag.Tag.name )

        // ProfileDTO
        const profileDTO = { email: account.email, name: account.name, student_id: account.studentId, phone: account.phone, birth: account.birth, sex: account.sex, tags: stringTag,}
        res.status(200).json(profileDTO);
    }catch(error){
        console.error(error);
        next(error);
    }
});

/** Login, Post
 * Content-type : application/json
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
 * Content-type : application/json
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

/** 알람 읽음 요청*/
router.get('/notification/:postId', passport.authenticate('jwt', {session: false}), async (req, res, next) => {
    try{
        const isRead = await Notification.destroy({
            where: { AccountId: req.user.id, PostId: req.params.postId},
        }) // 알림 읽음 처리 여부

        const cnt = await Notification.count({
            where: { AccountId: req.user.id, PostId: req.params.postId},
        })
        if(cnt == 0) { // 더 이상 알림이 존재하지 않으면, Account의 checkNotice를 false로 설정
            await Account.update({
                checkNotice: false,
            }, { where: { id: req.user.id}})
        }

        if(isRead) { // 알림 읽음 처리가 True이면, Accou
            return res.status(200).send("알림이 읽음 처리 되었습니다.");
        }
        res.status(403).send("요청을 확인하세요.");
    }catch (error){
        console.error(error);
        next(error)
    }
})

/** 알람 갱신 요청 */
router.get('/notification', passport.authenticate('jwt', {session: false}), async (req, res, next) => {
    try{
        const myNotification = await Notification.findAll({where: {AccountId: req.user.id}})
        const posts = await Promise.all(myNotification.map((noti) => Post.findOne({where: { id: noti.PostId }})))
        const result = [];
        myNotification.map((a, i) => {
            result.push({id: a.id, postId: posts[i].id, title: posts[i].title});
        })
        if(!myNotification){
           return res.status(404).json({id: null, postId: null, title: null});
        }
        res.status(200).json(result);
    }catch (error){
        console.error(error);
        next(error);
    }
})
module.exports = router;