const express = require("express");
const router = express.Router();
const User = require("../schemas/user");
const crypto = require("crypto");
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const headers = {origin : process.env.REACT_APP_URL};

//MyDID 아이디 생성
router.post("/register", async (req, res) => {
    try{
        const send_param = {
            headers,
            username: req.body.username,
            registerNumber: req.body.registerNumber
        };

        //로그인 체크
        if(req.session.email===undefined){
            res.json({message:"로그인 먼저 해주세요", code: "401"});
        }else{
            //체인넷 서버에서 아이디 등록
            await axios
            .post("https://mydid.kro.kr/auth/register", send_param)
            .then(returnData =>{
                if(returnData.data.key){
                    res.json({ message: returnData.data.message, code: "200", key: "1" });
                }else{
                    res.json({ message: returnData.data.message, code: "200" });
                }
            })
            //에러
            .catch(err => {
                console.log(err);
                res.json({ message: returnData.data.message, code: "500" });
            }); 
        }
    }catch (err){
        console.log(err);
        res.json({ message: "로그인을 다시 시도해주세요.", code: "500" });
    }
    
});


//MyDID 등록 처리
router.post("/confirmregister", async(req, res) => {
    try{
        const send_param = {
            headers,
            username: req.body.username,
            registerNumber: req.body.registerNumber
        };
        //로그인 체크
        if(req.session.email===undefined){
            res.json({message:"로그인 먼저 해주세요"});
        }else{

            //로그인이 되어있을 경우 user가 MyDID 발급을 한 사용자인지 확인
            await User.findOne({ email: req.session.email }, (err, user) => {
                //발급하지 않은 사용자가 맞을 경우
                if(user.auth==="0"){
                    //아이디 발급
                    axios
                    .post("https://mydid.kro.kr/auth/confirmregister", send_param)
                    .then(async returnData =>{
                        console.log("user update auth");
                        await User.updateOne(
                            {email: user.email},
                            //auth 값과 세션 값을 '1'로 변경
                            {$set: { auth: '1' }
                        });
                        req.session.auth = '1';
                        res.json({ message: returnData.data.message , auth:'1'});
                    })
                    //에러
                    .catch(err => {
                        console.log(err);
                        res.json({message : returnData.data.message, auth: '0'});
                    }); 
                }else{
                    //auth 세션 값을 '0'으로 유지
                    req.session.auth = user.auth;
                    res.json({message : returnData.data.message, auth: '0'});
                }
            });
        }
    }catch (err){
        console.log(err);
        res.json({ message: "로그인을 다시 시도해주세요." });
    }
    
});

//MyDID 로그인 인증 요청
router.post("/registersignin", async(req, res) => {
    try{
        const send_param = {
            headers,
            username: req.body.username,
            registerNumber: req.body.registerNumber
        };
        //로그인 체크
        if(req.session.email===undefined){
            res.json({message:"로그인 먼저 해주세요"});
        }else{

            //로그인이 되어있을 경우 user가 MyDID 발급을 한 사용자인지 확인
            await User.findOne({ email: req.session.email }, (err, user) => {
                //발급한 사용자가 맞을 경우
                if(user.auth==="1"){
                    axios
                    .post("https://mydid.kro.kr/auth/registersignin", send_param)
                    .then(returnData =>{
                        res.json({ message: returnData.data.message , auth:'1'});
                    })
                    //에러
                    .catch(err => {
                        res.json({ message: returnData.data.message , auth:'0'});
                        console.log(err);
                    }); 
                }else{
                    //user.auth가 '0'일 경우
                    res.json({message : "MyDID가 발급되지 않은 사용자입니다.", auth: '0'});
                }
            });
        }
    }catch (err){
        console.log(err);
        res.json({ message: "로그인을 다시 시도해주세요." });
    }
    
});

//MyDID 로그인 인증 확인
router.post("/confirmsignin", async(req, res) => {
    try{
        const send_param = {
            headers,
            username: req.body.username,
            registerNumber: req.body.registerNumber
        };
        //로그인 체크
        if(req.session.email===undefined){
            res.json({message:"로그인 먼저 해주세요"});
        }else{

            //로그인이 되어있을 경우 user가 MyDID 발급을 한 사용자인지 확인
            await User.findOne({ email: req.session.email }, (err, user) => {
                //발급한 사용자가 맞을 경우
                if(user.auth==="1"){
                    axios
                    .post("https://mydid.kro.kr/auth/confirmsignin", send_param)
                    .then(returnData =>{
                        res.json({ message: returnData.data.message , key: returnData.data.key});
                    })
                    //에러
                    .catch(err => {
                        console.log(err);
                        res.json({ message: returnData.data.message});
                    }); 
                }else{
                    res.json({message : returnData.data.message});
                }
            });
        }
    }catch (err){
        console.log(err);
        res.json({ message: "로그인을 다시 시도해주세요." });
    }
    
});

module.exports = router;
