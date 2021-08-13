const express = require('express');
const router = express.Router();
const passport = require('passport');
const { Account, Tag, AccountTag } = require('../models');

/** Set Account Tag, Post
 * Content-type : application/json
 * */
router.post('/setting', passport.authenticate('jwt', {session: false}), async (req, res, next) => {
    try{
        const getTags = req.body.tags;
        if(getTags){
            // Tag name으로 태그 찾아오기 (Tag의 id가 필요하기 때문이다.)
            const result = await Promise.all(getTags.map((tag) => Tag.findOrCreate({where: { name: tag },})))
            // Tag를 모두 돌며 AccountTag에 등록하기
            await Promise.all(result.map((tag) => {
               AccountTag.findOrCreate({
                   where: {
                       account_id: req.user.id, /// AccountId -> account_id
                       tag_id: tag[0].id, } /// TagId -> tag_id
                });
            }))
            /**
             * v가 아닌 v[0]인 이유는 v[0]안에 Tag가 들어있다..
             * 안되길래 Log찍어보다 찾았네...
             * */
        }
        res.status(215).send();
    }catch (error) {
        console.error(error);
        next(error);
    }
})

/** Get Account Tag, Get */
router.get('/setting', passport.authenticate('jwt', {session: false}), async (req, res, next) => {
    try{
        const accountTags = await AccountTag.findAll({ where: { account_id: req.user.id } }) // Tags (모든 정보 같고 있는 객체), AccountId -> account_id
        // AccountTag에서 가져온 TagId로 Tag들 가져오기.
        const tags = await Promise.all(accountTags.map((accountTag) =>
            Tag.findOne({
            where: { id: accountTag.tag_id }, /// TagId -> tag_id
        })));
        // 문자열 배열(stringTag)로 만들기
        const stringTag = [];
        tags.forEach( tag => { stringTag.push(tag.name)})
        res.status(200).json(stringTag);
    }catch (error) {
        console.error(error);
        next(error);
    }
})

module.exports = router;