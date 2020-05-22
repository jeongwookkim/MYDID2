const express = require("express");
const router = express.Router();
const User = require("../schemas/user");
const crypto = require("crypto");

router.post("/", (req, res) => {
    console.log(req.session.email);
    console.log(req.body.fingerprint);
    let auth_ok = req.body.fingerprint;
    res.json({ message: "인증완료", auth_ok : auth_ok});
});


module.exports = router;
