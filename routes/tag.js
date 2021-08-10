const express = require('express');
const router = express.Router();
const passport = require('passport');
const { Account, Tag } = require('../models');

/** Set Account Tag, Post
 * Context-type : application/json
 * */
router.post('/setting', passport.authenticate('jwt', {session: false}), async (req, res, next) => {
    try{
        const account = await Account.findOne( {where: { id: req.user.id}});
        const getTags = req.body.tags;
        if(getTags){
            const result = await Promise.all(getTags.map((tag) => Tag.findOrCreate({where: { name: tag },})))
            await account.addTags(result.map((v) => v[0]));
            /**
             * v가 아닌 v[0]인 이유는 v[0]안에 Tag가 들어있다..
             * 안되길래 Log찍어보다 찾았네...
             * */
        }
        res.status(215);
    }catch (error) {
        console.error(error);
        next(error);
    }
})

/** Get Account Tag, Get */
router.get('/setting', passport.authenticate('jwt', {session: false}), async (req, res, next) => {
    try{
        const account = await Account.findOne({where: { id: req.user.id }});
        const tags = await account.getTags(); // Tags (모든 정보 같고 있는 객체)
        const stringTag = [];
        tags.forEach( tag => { stringTag.push(tag.name)}) // 문자열 배열(stringTag)로 만들기
        res.json(stringTag);
    }catch (error) {
        console.error(error);
        next(error);
    }
})

module.exports = router;