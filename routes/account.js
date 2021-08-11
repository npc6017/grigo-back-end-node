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

/** 알람 읽음 요청, Get */
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

/** 알람 갱신 요청, Get */
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

/** 비밀번호 수정 요청, Post */
router.post('/settings/password', passport.authenticate("jwt", {session: false}), async (req, res, next) => {
    try{
        // 기존 비밀번호 체크
        const isDBpw = await Account.findOne({where: { id: req.user.id}});
        const isCheckBasic = await bcrypt.compare(req.body.password, isDBpw.password);

        // 변경 불허!
        if(!isCheckBasic)
            return res.status(400).json({status : 400, errormessage: "비밀번호가 일치하지 않습니다."});

        // 새로운 비밀번호와 확인 비밀번호 체크
        if(!(req.body.newPassword == req.body.newConfirmPassword))
            return res.status(400).json({status : 400, errormessage: "새로운 비밀번호가 일치하지 않습니다."});

        // 모든 검증 통과, 변경 진행
        const newPassword = await bcrypt.hash(req.body.newPassword, 12);
        await Account.update({
            password: newPassword,
        }, { where: { id: req.user.id }});

        res.status(200).json({status : 200, errormessage: "비밀번호가 성공적으로 변경되었습니다."});


    }catch (error){
        console.error(error);
        next(error);
    }
})

/** 프로필 업데이트 요청, Post */
router.post('/settings/profile', passport.authenticate('jwt', {session: false}), async (req, res, next) => {
    try{
        // 기본 정보(Phone, Birth) 변경
        await Account.update({
            phone: req.body.phone,
            birth: req.body.birth,
        }, { where: { id: req.user.id }});
        // 사용자 태크 정보 변경
        /// 삭제할 태그 처리
        const deleteTagsObj = await Promise.all(req.body.deletedTags.map((deletedTag) =>
             Tag.findOne({where: { name: deletedTag}})
        ));
        // 사용자의 태그가 비어있지 않을 때, 삭체 처리 진행.
        await Promise.all(deleteTagsObj.map((deleteTagObj) => {
            if(deleteTagObj != null)
                AccountTag.destroy({where: {AccountId: req.user.id, TagId: deleteTagObj.id}});
        }))

        /// 추가할 태그 처리
        const getTags = req.body.addTags;
        if(getTags) {
            // Tag name으로 태그 찾아오기 (Tag의 id가 필요하기 때문이다.)
            const result = await Promise.all(getTags.map(async (tag) => await Tag.findOrCreate({where: {name: tag},})))
            // Tag를 모두 돌며 AccountTag에 등록하기
            await Promise.all(result.map( async (tag) => {
                await AccountTag.findOrCreate({
                    where: {
                        AccountId: req.user.id,
                        TagId: tag[0].id,
                    }
                });
            }))
        }
        /**
         * v가 아닌 v[0]인 이유는 v[0]안에 Tag가 들어있다..
         * 안되길래 Log찍어보다 찾았네...
         * */
        // ProfileDTO 생성 과정
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

    } catch (error){
        console.error(error);
        next(error);
    }
})
module.exports = router;