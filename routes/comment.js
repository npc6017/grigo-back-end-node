const express = require('express');
const router = express.Router();
const passport = require('passport');
const { Comment, Post } = require('../models');

/** Save Comment, Post
 * Content-type : application/json
 * Body Data : content
 * */
router.post('/:postId/comment', passport.authenticate('jwt', {session: false}), async (req, res, next) => {
    try{
        // 게시글 체크
        const post = await Post.findOne({where : { id: req.params.postId}});
        if(!post){
            return res.status(400).send("게시글이 존재하지 않습니다.");
        }
        await Comment.create({
            content: req.body.content,
            account_id: req.user.id, /// AccountId -> account_id
            PostId: post.id,
        })
        res.status(200).send("댓글을 성공적으로 작성하였습니다.");
    }catch (error){
        console.error(error);
        next(error);
    }
})

/** Delete Comment, Post */
router.post('/comment/:commentId', passport.authenticate('jwt', {session: false}), async (req, res, next) => {
    try {
        // 댓글 존재 유무 및 본인 소유 여부 확인
        const comment = await Comment.findOne({where: { id: req.params.commentId, account_id: req.user.id}}); /// AccountId -> account_id
        if(!comment){ // 댓글 탐색 결과가 없는경우,
            return res.status(400).send("잘못된 접근입니다.");
        }
        // 삭제 진행
        await Comment.destroy({ where: { id: comment.id } });
        res.status(200).send("댓글이 정상적으로 삭제되었습니다.");
    } catch(error) {
        console.error(error);
        next(error);
    }
})

/** Update Comment, Post
 * Content-type : application/json */
router.post('/comment/change/:commentId', passport.authenticate('jwt', {session: false}), async (req, res, next) =>{
    try{
        // 댓글 존재 유무 및 본인 소유 여부 확인
        const comment = await Comment.findOne({where: { id: req.params.commentId, account_id: req.user.id}}); /// AccountId -> account_id
        if(!comment){
            return res.status(400).send("잘못된 접근입니다.");
        }
        await Comment.update({
            content: req.body.content,
        }, { where: { id: comment.id } })

        res.status(200).send("댓글이 성공적으로 수정되었습니다.");

    }catch (error){
        console.error(error);
        next(error);
    }
})

module.exports = router;