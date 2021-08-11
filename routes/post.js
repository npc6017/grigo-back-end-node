const express = require('express')
const router = express.Router();
const passport = require('passport')
const { Post, Tag, PostTag, AccountTag, Notification, Account } = require('../models');

/** Save Post, Post
 * Content-type : application/json
 * */
router.post('/save', passport.authenticate(`jwt`, {session: false}),
    async (req, res, next) => {
        try{
            // Post 생성(Tag는 다음 로직에서 처리)
            const savedPost = await Post.create({
                title: req.body.title,
                boardType: req.body.boardType,
                content: req.body.content,
                AccountId: req.user.id,
            });
            // tag name으로 Tag객체를 받아서 Post에 넣기
            const tags = await Promise.all(req.body.tag.map((tag) => Tag.findOne({where: {name : tag},})));
            await Promise.all(tags.map((tag) =>
                PostTag.findOrCreate({
                    where: {
                        PostId: savedPost.id,
                        TagId: tag.id,
                    }
                })))
            /** (위 로직)tag 라우터에서 findOrCreate에서는 tags.map((v) => v[0]) 이렇게 0번 인덱스를 뽑아야 했는데,
             * 이번엔 다르네..? findOrCreate와 findOne의 응답 데이터 차이인가보다. */

                // 알림 설정하기(Notification 생성)

                /// Tag를 가지고 있는 account 가져오기,
            const accounts = await Promise.all(tags.map((tag) =>
                    AccountTag.findAll({
                        where: { TagId: tag.id }
                    })
                ));

            // [[Account, Account], [Account, Account]] -> [Account, Account, Account, Account] 방식으로
            // 탐색하며 accountId를 중복없이 꺼내온다.
            const accountIds = []
            accounts.map((ac) => { ac.map((a) => {
                if(!accountIds.includes(a.AccountId)){
                    accountIds.push(a.AccountId)
                }
            })});
            // 알림 생성 및 설정
            accountIds.map(async (ac) => {
                await Notification.create({AccountId: ac, PostId: savedPost.id});
                await Account.update({checkNotice: true}, {where: { id: ac}})
            })

            res.status(200).send("post save successful");
        }catch (error){
            console.error(error);
            next(error);
        }
    });

/** Update Post, Post
 * content-Type
 * */
router.post('/:postId/update', passport.authenticate('jwt', {session: false}),
    async (req, res, next) => {
        try{
            // 게시글이 존재하는지, 본인 게시글인지 확인
            const exPost = await Post.findOne({where: { id: req.params.postId, AccountId: req.user.id}});
            // 없는 경우
            if(!exPost){
                return res.status(404).send("post not found");
            }
            // 내 게시글이 맞는 경우, 업데이트 진행
            await Post.update({
                title: req.body.title,
                content: req.body.content,
                boardType: req.body.boardType,
            },{
                where: { id: exPost.id}
            })
            // ToDo Tags Update

            res.status(200).send("post update succesful");
        }catch (error){
            console.log(error);
            next(error);
        }
    })

/** Delete Post, Post
 * Content-type : application/json
 * */
router.post('/:postId/delete', passport.authenticate('jwt', {session: false}), async (req, res, next) => {
    try{
        // 게시글이 존재하는지, 본인 게시글인지 확인
        const exPost = await Post.findOne({where: { id: req.params.postId, AccountId: req.user.id}});
        // 게시글이 존재하면 삭제, 없으면 에러 처리
        // 게시글 삭제되면서 PostTag의 삭제 게시글 또한 같이 삭제처리가 된다.
        if(!exPost){
            return res.status(404).send("post not found");
        }
        await Post.destroy({where: {id : exPost.id}})
        return res.status(200).send("post delete successful");
    } catch (error) {
        console.error(error);
        next(error);
    }
});

/** Get Post, Get */
router.get('/:postId', passport.authenticate('jwt', {session: false}), async (req, res, next) => {
    try{
        const post = await Post.findOne({where: { id: req.params.postId },
        include: [Account, PostTag]});
        if(!post)
            return res.status(404).send("요청 정보를 확인하시기 바랍니다.");
        // TagId를 통해 tag객체들 가져오기
        const tags = await Promise.all(post.PostTags.map((postTag) => Tag.findOne({where: { id: postTag.TagId}})))
        // Tag의 name만 추출.
        const stringTags = tags.map((tag) => tag.name);

        // DTO 만들기
        const result = {
            id: post.id,
            title: post.title,
            writer: post.Account.email,
            content: post.content,
            boardType: post.boardType,
            tag: stringTags,
            comment : null,
            timestamp: post.createdAt,
        }

        res.status(200).json(result);
    }catch (error){
        console.error(error);
        next(error);
    }
})
module.exports = router;
