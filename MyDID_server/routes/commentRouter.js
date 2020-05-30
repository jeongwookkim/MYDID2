const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Board = require("../schemas/board");
const Comment = require("../schemas/comment");


router.post("/writecomment", async (req, res) => {
  try {
    const session = req.session._id;
    const _id = req.body._id;
    console.log(_id);
    console.log(session);
    console.log(req.body._comment);
    let obj;

    if(req.session.id){
        obj = {
          board_id: req.body._id, //게시글 번호
          writer: req.session._id, //댓글작성자
          comment: req.body._comment,
        };
        console.log("obj" + obj);
        const comment = new Comment(obj);
        await comment.save();
        res.json({ message: "댓글이 작성되었습니다." });
    }else{
      res.json({message: "세션 끊김 재로그인 필요"});
    }    
  } catch (err) {
    console.log(err);
    res.json({ message: "false" });
  }
});

router.post("/delete", async (req, res) => {
    try {
        const _id = req.body._id;
        //const board = await Board.find({ _id });
        const comment = await Comment.find({_id});
        //console.log(board);
        //console.log(comment[0].writer);
        const writer = comment[0].writer;
        
        if(req.session._id==writer){
          await Comment.remove({
            _id: req.body._id,
          });
          res.json({ message: "삭제되었습니다." });
        }else{
          res.json({message:"내가 쓴 댓글만 삭제할 수 있습니다.", refresh: true});
        }
    } catch (err) {
        console.log(err);
        res.json({ message: false });
    }
});

module.exports = router;
