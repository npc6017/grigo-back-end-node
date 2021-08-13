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
                account_id: req.user.id, /// AccountId -> account_id
            });
            // tag name으로 Tag객체를 받아서 Post에 넣기
            const tagsObj = await Promise.all(req.body.tags.map((tag) => Tag.findOne({where: {name : tag},})));
            await Promise.all(tagsObj.map((tag) =>
                PostTag.findOrCreate({
                    where: {
                        post_id: savedPost.id, /// PostId -> post_id
                        tag_id: tag.id, /// TagId -> tag_id
                    }
                })))
            /** (위 로직)tag 라우터에서 findOrCreate에서는 tags.map((v) => v[0]) 이렇게 0번 인덱스를 뽑아야 했는데,
             * 이번엔 다르네..? findOrCreate와 findOne의 응답 데이터 차이인가보다. */

                // 알림 설정하기(Notification 생성)

                /// Tag를 가지고 있는 account 가져오기,
            const accounts = await Promise.all(tagsObj.map((tag) =>
                    AccountTag.findAll({
                        where: { tag_id : tag.id } /// AccountId -> account_id
                    })
                ));

            // [[Account, Account], [Account, Account]] -> [Account, Account, Account, Account] 방식으로
            // 탐색하며 accountId를 중복없이 꺼내온다.
            const accountIds = []
            accounts.map((ac) => { ac.map((a) => {
                if(!accountIds.includes(a.account_id)){
                    accountIds.push(a.account_id)
                }
            })});
            // 알림 생성 및 설정
            accountIds.map(async (ac) => {
                await Notification.create({AccountId: ac, PostId: savedPost.id}); /// PostId -> post_id
                await Account.update({check_notice: true}, {where: { id: ac}}) /// checkNotice -> check_notice
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
            order: [['time_stamp', 'DESC']], // 최신 게시글부터, ///createAt -> time_stamp
            include: [Account, {
                model: PostTag, include : {
                    model: Tag
                }
            }],
            attributes: { exclude: ['updatedAt']}
        });

        // 다음 데이터가 있는지 여부 확인
        const hasNext = posts.length == 0 ? false : true;

        const postDTOS = await Promise.all(posts.map(async (post) => {
            const stringTags = post.PostTags.map((tag) => {
                return tag.Tag.name;
            })
            return {
                id: post.id,
                title: post.title,
                writer: post.Account.name,
                content: post.content,
                boardType: post.boardType,
                tags: stringTags,
                comments: null, // 필요 없음
                timeStamp: post.time_stamp, /// createAt -> time_stamp
                userCheck: post.Account.id == req.user.id
            }
        }))
        result = {postDTOS: postDTOS, hasNext: hasNext} /// postsDTOS -> postDTOS

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
            const exPost = await Post.findOne({where: { id: req.params.postId, account_id: req.user.id}}); /// AccountId -> account_id
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
            if(req.body.deletedTags != undefined){
                const deleteTagsObj = await Promise.all(req.body.deletedTags.map((deletedTag) =>
                    Tag.findOne({where: { name: deletedTag}})
                ));
                // 글의 태그가 비어있지 않을 때, 삭체 처리 진행.
                await Promise.all(deleteTagsObj.map((deleteTagObj) => {
                    if(deleteTagObj != null)
                        PostTag.destroy({where: {post_id: exPost.id, tag_id: deleteTagObj.id}}); /// PostId -> post_id
                }))
            }
            /// 추가할 태그 처리
            if(req.body.addTags != undefined) {
                const getTags = req.body.addTags;
                // Tag name으로 태그 찾아오기 (Tag의 id가 필요하기 때문이다.)
                const result = await Promise.all(getTags.map(async (tag) => await Tag.findOrCreate({where: {name: tag},})))
                console.log(result);
                // Tag를 모두 돌며 PostTag에 등록하기
                await Promise.all(result.map(async (tag) => {
                    await PostTag.findOrCreate({
                        where: {
                            post_id: exPost.id, /// PostId -> post_id
                            tag_id: tag[0].id,/// TagId -> tag_id
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
        const exPost = await Post.findOne({where: { id: req.params.postId, account_id: req.user.id}}); /// AccountId -> account_id
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
            include: [{ model: Account }, { model: PostTag}, { model: Comment, attributes: { exclude: ['updatedAt', 'post_id']} }], /// PostId -> post_id
        });
        if(!post)
            return res.status(404).send("요청 정보를 확인하시기 바랍니다.");
        // TagId를 통해 tag객체들 가져오기
        const tags = await Promise.all(post.PostTags.map((postTag) => Tag.findOne({where: { id: postTag.tag_id}}))) /// TagId -> tag_id
        // Tag의 name만 추출.
        const stringTags = tags.map((tag) => tag.name);
        // 나의 글인지 판단
        const isMyPost =  post.Account.id == req.user.id;
        // 댓글DTO 만들기
        const commentDTOS = await Promise.all((post.Comments.map( async (comment) => {
            // Account 이름 가져오기
            const cmtAccount = await Account.findOne({where: { id: comment.account_id }}); /// AccountId -> account_id
            // 나의 댓글인치 확인
            const isMyComment = comment.account_id == req.user.id; /// AccountId -> account_id
            return { id: comment.id, content: comment.content, writer: cmtAccount.name, timestamp: comment.createdAt, userCheck: isMyComment }
        })));

        // PostDTO 만들기
        const result = {
            id: post.id,
            title: post.title,
            writer: post.Account.name,
            content: post.content,
            boardType: post.boardType,
            tags: stringTags, // tag -> tags
            comments: commentDTOS,
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
