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
    let obj;

    //로그인 체크
    if(req.session._id && req.session.myDIDLogin){
        obj = {
          board_id: req.body._id, //게시글 번호
          writer: req.session._id, //댓글작성자
          comment: req.body._comment,
        };
        const comment = new Comment(obj);
        await comment.save();
        res.json({ message: "댓글이 작성되었습니다." });
    }else{
      res.json({message: "세션이 만료되었습니다. 다시 로그인 해주세요.", logout :"1"});
    }    
  } catch (err) {
    console.log(err);
    res.json({ message: "false" });
  }
});

router.post("/delete", async (req, res) => {
    try {
        const _id = req.body._id;
        const comment = await Comment.find({_id});
        const writer = comment[0].writer;
      //로그인 체크
      if(req.session._id && req.session.myDIDLogin){
          if(req.session._id==writer){
            await Comment.remove({
              _id: req.body._id,
            });
            res.json({ message: "삭제되었습니다." });
          }else{
            res.json({message:"내가 쓴 댓글만 삭제할 수 있습니다.", refresh: true});
          }
        }else{
          res.json({message: "세션이 만료되었습니다. 다시 로그인 해주세요.", logout :"1"});
        }
    } catch (err) {
        console.log(err);
        res.json({ message: false });
    }
});

module.exports = router;
