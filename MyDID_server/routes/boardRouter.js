const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Board = require("../schemas/board");
const Comment = require("../schemas/comment");

let storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "public/upload/");
  },
  filename: function (req, file, callback) {
    let extension = path.extname(file.originalname);
    let basename = path.basename(file.originalname, extension);
    callback(null, Date.now() + extension);
  },
});

const upload = multer({
  dest: "public/upload/",
  storage: storage,
});

router.post("/delete", async (req, res) => {
  try {
    const _id = req.body._id;
    const writer =req.body.writer;

    //로그인 체크
    if(req.session._id && req.session.myDIDLogin){
      if(writer===req.session._id){
        await Board.remove({
          _id: _id,
        });
        res.json({ message: "삭제 되었습니다." });
      } else {
        res.json({ message: "내가 쓴 글만 삭제할 수 있습니다." });
      }
    }else{
      res.json({message: "세션이 만료되었습니다. 다시 로그인 해주세요.", logout : '1'});
    }
  } catch (err) {
    console.log(err);
    res.json({ message: false });
  }
});

router.post("/update", upload.single("imgFile"), async (req, res) => {
  try{    
    
    const _id = req.body.boardId;//board 게시물 id
    console.log(_id);
    const file = req.file;

    //로그인 체크
    if(req.session._id && req.session.myDIDLogin){
      if (file == undefined) {
        await Board.update(
          { _id: req.body.boardId },
          {
            $set: {
              writer: req.session._id,
              title: req.body.title,
              content: req.body.content,
            },
          }
        );
      } else {
        await Board.update(
          { _id: req.body.boardId },
          {
            $set: {
              writer: req.session._id,
              title: req.body.title,
              content: req.body.content,
              imgPath: file.filename,
            },
          }
        );
      }
      res.json({ message : "게시글이 수정되었습니다." });
    }else{
      res.json({message: "세션이 만료되었습니다. 다시 로그인 해주세요.", logout :"1"});
    }
  } catch (err) {
    console.log(err);
    res.json({ message: false });
  }

});

router.post("/write", upload.single("imgFile"), async (req, res) => {
  try {
    const file = req.file;
    console.log(file);
    let obj;
    //로그인 체크
    if(req.session._id && req.session.myDIDLogin){
      if (file == undefined) {
        obj = {
          writer: req.session._id,
          title: req.body.title,
          content: req.body.content,
        };
      } else {
        obj = {
          writer: req.session._id,
          title: req.body.title,
          content: req.body.content,
          imgPath: file.filename,
        };
      }

      const board = new Board(obj);
      await board.save();
      res.json({ message: "게시글이 업로드 되었습니다." });
    }else{
      res.json({message: "세션이 만료되었습니다. 다시 로그인 해주세요.", logout :"1"});
    }
  } catch (err) {
    console.log(err);
    res.json({ message: false });
  }
});

router.post("/getBoardList", async (req, res) => {
  try {
    //로그인 체크
    if(req.session._id && req.session.myDIDLogin){
      const board = await Board.find({}, null, {
        sort: { createdAt: -1 },
      }).populate("writer");
      console.log(board);

      res.json({ list: board });
    }else{
      res.json({message: "세션이 만료되었습니다. 다시 로그인 해주세요.", logout :"1"});
    }
  } catch (err) {
    console.log(err);
    res.json({ message: false });
  }
});

router.post("/detail", async (req, res) => {
  try {
    //로그인 체크
    if(req.session._id && req.session.myDIDLogin){
      const _id = req.body._id;
      const board = await Board.find({ _id }).populate("writer");
      const comment = await Comment.find({board_id: _id}).sort({ createdAt: -1 }).populate("writer");
      res.json({ board, comment });
    }else{
      res.json({message: "세션이 만료되었습니다. 다시 로그인 해주세요.", logout :"1"});
    }
  } catch (err) {
    console.log(err);
    res.json({ message: false });
  }
});

module.exports = router;
