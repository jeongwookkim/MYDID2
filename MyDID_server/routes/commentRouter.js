const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Board = require("../schemas/board");
const Comment = require("../schemas/comment");


router.post("/writecomment", async (req, res) => {
  try {
    const _id = req.body._id;
    console.log(req.body.login_email);
    /* const comment = await Comment.find(
      ); */
    //console.log(req.body);
    let obj;

    if (req.body !== undefined) {
      obj = {
        writer: req.body.login_email, //댓글작성자
        comment: req.body._comment,
      };
      console.log("obj" + obj);
    } else {
      res.json({ m });
    }

    const comment = new Comment(obj);
    await comment.save();
    res.json({ message: "댓글이 작성되었습니다." });
  } catch (err) {
    console.log(err);
    res.json({ message: false });
  }
});

router.post("/delete", async (req, res) => {
    try {
        const _id = req.body._id;
        const login_email = req.body.login_email;

        console.log(_id+" : "+login_email);
        //const board = await Board.find({ _id });
        const comment = await Comment.find({_id});
        //console.log(board);
        console.log(comment[0].writer);
        const writer = comment[0].writer;
        
        if(req.body.login_email==writer){
          await Comment.remove({
            _id: req.body._id,
          });
          res.json({ message: "삭제되었습니다." });
        }else{
          res.json({message:"내가 쓴 글만 삭제할 수 있습니다."});
        }
    } catch (err) {
        console.log(err);
        res.json({ message: false });
    }
});

module.exports = router;
