const express = require("express");
const router = express.Router();
const User = require("../schemas/user");
const crypto = require("crypto");

router.post("/", async (req, res) => {
    try{
        console.log(req.session.email);
        console.log(req.body.fingerprint);
        const auth_ok = req.body.fingerprint;
        if(req.session.email===undefined){
            res.json({message:"로그인먼저 해주세요"});
        }else{
            await User.findOne({ email: req.session.email }, async (err, user) => {
                //console.log(user.auth);
                if(user.auth==="0"){
                    await User.updateOne(
                        {
                            email: user.email
                        },
                        { $set: { auth: auth_ok } }
                    );
                    req.session.auth=auth_ok;
                    res.json({ message: "인증완료",auth_ok:auth_ok});
                }else{
                    req.session.auth = user.auth;
                    console.log("session.aut : " + req.session.auth);
                }
            });
        }
    }catch (err){
        console.log(err);
        res.json({ message: false });
    }
    
});

module.exports = router;
