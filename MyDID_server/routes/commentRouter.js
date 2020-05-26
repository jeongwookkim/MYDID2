const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Board = require("../schemas/board");
const Comment = require("../schemas/comment");

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
