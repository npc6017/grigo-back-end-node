const express = require('express')
const router = express.Router();
const passport = require('passport')
const { Post, Tag, PostTag, AccountTag, Notification, Account, Comment } = require('../models');
const { Op } = require('sequelize');

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

/** Get Posts(Pagination), Get */
router.get('/board', passport.authenticate('jwt', {session: false}), async (req, res, next) => {
    try {// id, size, type
        // where 조건을 미리 정의.
        const where = { boardType: req.query.type };
        if(parseInt(req.query.id, 10)) {
            // Op.lt: 5 -> 5보다 작은 것들 / where.id 이므로 id가 5보다 작은 것들!
            // 만약 10개인데 100보다 작은 것을 요청하면 10부터 가져온다.
            // 개수는 아래 limit으로 설정
            where.id = { [Op.lt]: parseInt(req.query.id, 10)}
        }
        const posts = await Post.findAll({
            where,
            limit: req.query.size,
            order: [['createdAt', 'DESC']], // 최신 게시글부터
            include: [Account],
            attributes: { exclude: ['updatedAt']}
        });

        // 다음 데이터가 있는지 여부 확인
        const hasNext = posts.length == 0 ? false : true;

        const postDTOS = await Promise.all(posts.map((post) => {
            return {
                id: post.id,
                title: post.title,
                writer: post.Account.name,
                content: post.content,
                boardType: post.boardType,
                tags: null,
                comments: null,
                timeStamp: post.createdAt,
                userCheck: post.Account.id == req.user.id
            }
        }))
        result = {postsDTOS: postDTOS, hasNext: hasNext}

        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

/** Update Post, Post
 * content-Type : application/json
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
            /// 삭제할 태그 처리
            const deleteTagsObj = await Promise.all(req.body.deletedTags.map((deletedTag) =>
                Tag.findOne({where: { name: deletedTag}})
            ));
            // 글의 태그가 비어있지 않을 때, 삭체 처리 진행.
            await Promise.all(deleteTagsObj.map((deleteTagObj) => {
                if(deleteTagObj != null)
                    PostTag.destroy({where: {PostId: exPost.id, TagId: deleteTagObj.id}});
            }))
            /// 추가할 태그 처리
            const getTags = req.body.addTags;
            if(getTags) {
                // Tag name으로 태그 찾아오기 (Tag의 id가 필요하기 때문이다.)
                const result = await Promise.all(getTags.map(async (tag) => await Tag.findOrCreate({where: {name: tag},})))
                // Tag를 모두 돌며 PostTag에 등록하기
                await Promise.all(result.map( async (tag) => {
                    await PostTag.findOrCreate({
                        where: {
                            PostId: exPost.id,
                            TagId: tag[0].id,
                        }
                    });
                }))
            }
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
        const post = await Post.findOne({
            where: { id: req.params.postId },
            include: [{ model: Account }, { model: PostTag}, { model: Comment, attributes: { exclude: ['updatedAt', 'PostId']} }],
        });
        if(!post)
            return res.status(404).send("요청 정보를 확인하시기 바랍니다.");
        // TagId를 통해 tag객체들 가져오기
        const tags = await Promise.all(post.PostTags.map((postTag) => Tag.findOne({where: { id: postTag.TagId}})))
        // Tag의 name만 추출.
        const stringTags = tags.map((tag) => tag.name);
        // 나의 글인지 판단
        const isMyPost =  post.Account.id == req.user.id;
        // 댓글DTO 만들기
        const commentDTOS = await Promise.all((post.Comments.map( async (comment) => {
            // Account 이름 가져오기
            const cmtAccount = await Account.findOne({where: { id: comment.AccountId }});
            // 나의 댓글인치 확인
            const isMyComment = comment.AccountId == req.user.id;
            return { id: comment.id, content: comment.content, writer: cmtAccount.name, timestamp: comment.createdAt, userCheck: isMyComment }
        })));

        // PostDTO 만들기
        const result = {
            id: post.id,
            title: post.title,
            writer: post.Account.name,
            content: post.content,
            boardType: post.boardType,
            tag: stringTags,
            comment : commentDTOS,
            userCheck: isMyPost,
            timestamp: post.createdAt,
        }

        res.status(200).json(result);
    }catch (error){
        console.error(error);
        next(error);
    }
})


module.exports = router;
