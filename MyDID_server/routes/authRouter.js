const express = require("express");
const router = express.Router();
const User = require("../schemas/user");
const crypto = require("crypto");

//회원가입 이후 최초 MyDID 등록 시
router.post("/", async (req, res) => {
    try{
        //로그인 체크
        if(req.session.email===undefined){
            res.json({message:"로그인 먼저 해주세요"});
        }else{
            //로그인이 되어있을 경우 user가 MyDID 발급을 한 사용자인지 확인
            await User.findOne({ email: req.session.email }, async (err, user) => {
                //발급하지 않은 사용자가 맞을 경우
                if(user.auth==="0"){
                    await User.updateOne(
                        {email: user.email},
                        //auth 값과 세션 값을 '1'로 변경
                        {$set: { auth: '1' }
                    });
                    req.session.auth = '1';
                    res.json({ message: "인증완료", auth:'1'});
                }else{
                    //auth 세션 값을 '0'으로 유지
                    req.session.auth = user.auth;
                    res.json({message : "인증실패", auth: '0'});
                }
            });
        }
    }catch (err){
        console.log(err);
        res.json({ message: false });
    }
    
});

module.exports = router;
