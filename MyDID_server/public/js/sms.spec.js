/* 'use strict';

var sms = require('./sms');

function sendSMS(){
    sms.send({
      msg: '카페24 SMS 테스트',
      mobile: '01000000000'
    }).then(function (result) {
      console.log(result);
      done();
    }).done(null, done);
}
sendSMS(); */