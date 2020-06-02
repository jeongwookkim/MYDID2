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

// router.all("*", (req, res, next)=>{
//   if(req.session.email!==undefined){
//     if(req.session.auth!==undefined){
//       next();
//     }
//     else{
//       res.redirect("/");
//     }
//   }else{
//       res.redirect("/");
//   }
// });

router.post("/delete", async (req, res) => {
  try {
    const _id = req.body._id;
    const writer =req.body.writer;
    console.log("bodyid : "+ _id);
    console.log("writer : "+writer);
    console.log("session id : "+req.session._id);
    // const board = await Board.find({ _id }).populate("writer");
    // console.log(board[0].writer._id);
    if(writer===req.session._id){
      await Board.remove({
        _id: _id,
      });
      res.json({ message: "삭제되었습니다." });
    } else {
      res.json({ message: "내가 쓴 글만 삭제할 수 있습니다." });
    }
  } catch (err) {
    console.log(err);
    res.json({ message: false });
  }
});

router.post("/update", upload.single("imgFile"), async (req, res) => {
  try{    
    
    //console.log("update "+ req.body._id);
    const _id = req.body.boardId;//board 게시물 id
    console.log(_id);
    //console.log("session id : "+req.session._id);
    //const board = await Board.find({ _id }).populate("writer");
    //console.log("update board : "+ board[0]._id);
    const file = req.file;

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
  } catch (err) {
    console.log(err);
    res.json({ message: false });
  }
});

router.post("/getBoardList", async (req, res) => {
  try {
    const board = await Board.find({}, null, {
      sort: { createdAt: -1 },
    }).populate("writer");
    console.log(board);

    /*   const board = await Board.find(
      { writer: _id }, null, {
      sort: { createdAt: -1 },
    } 
    ); */
    res.json({ list: board });
  } catch (err) {
    console.log(err);
    res.json({ message: false });
  }
});

router.post("/detail", async (req, res) => {
  try {
    const _id = req.body._id;
    const board = await Board.find({ _id }).populate("writer");
    const comment = await Comment.find({}).sort({ createdAt: -1 }).populate("writer");

    //console.log("board writer id : "+ board[0].writer);
    console.log("board writer name : "+ comment.writer);

    res.json({ board, comment });
    //console.log(comment[0].writer);
  } catch (err) {
    console.log(err);
    res.json({ message: false });
  }
});

module.exports = router;
