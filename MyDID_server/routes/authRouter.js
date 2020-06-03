'use strict';

const express = require("express");
const router = express.Router();
const User = require("../schemas/user");
const crypto = require("crypto");
const axios = require("axios");
const dotenv = require("dotenv");
const sms = require('../public/js/sms.js');

dotenv.config();

const headers = {origin : process.env.REACT_APP_URL};

//MyDID 로그인 인증 요청
router.post("/registersignin", async(req, res) => {
    try{

/*         try{
        console.log("------------------------------------");
        await sms.send({
            msg: '카페24 SMS 테스트',
            mobile: '010-3345-5366'
        }).then(function (result) {
            console.log(result);
        })
        }catch(err){
            console.log(err);
        }
        console.log("------------------------------------"); */

        const send_param = {
            phoneNumber: req.session.phoneNumber
        };
        // console.log(send_param);
        //로그인 체크
        if(req.session.email===undefined){
            res.json({message:"로그인을 다시 시도해주세요."});

        }else{
            axios
            .post("https://mydid.kro.kr/auth/registersignin", send_param)
            .then(returnData =>{
                if(returnData.data.key === '1'){
                    req.session.myDIDLogin = '1';
                }
                res.json({ message: returnData.data.message , returnCode : returnData.data.key});
            })
            //에러
            .catch(err => {
                res.json({ message: "서버 요청에 실패하였습니다. 재요청 해주시기 바랍니다."});
                console.log(err);
            }); 
        }
    }catch (err){
        console.log(err);
        res.json({ message: "로그인을 다시 시도해주세요." });
    }
    
});

module.exports = router;
