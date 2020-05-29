import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import axios from "axios";
import $ from "jquery";
import {} from "jquery.cookie";
import QRCode from 'qrcode'
axios.defaults.withCredentials = true;
const headers = { withCredentials: true };

function AuthForm(){

    const goFido = ()=>{
      const send_param = {
        headers,
        //_id: $.cookie("login_id")
        fingerprint:"1234567890"
      };

      axios
        .post("http://localhost:8080/auth", send_param)
        .then(returnData =>{
            console.log(returnData)
          if (returnData.data.message) {
            console.log("auth_ok:" + returnData.data.auth_ok);
            $.cookie("auth_ok", returnData.data.auth_ok, { expires: 1 });
            console.log($.cookie("auth_ok"));
            alert(returnData.data.message + " : "+returnData.data.auth_ok);
            window.location.reload();
          } else {
            alert(returnData.data.message);
          }
        })
      //에러
        .catch(err => {
          console.log(err);
        });
    }


    const gihoon = ()=>{
      const send_param = {
        username:11,
        registerNumber:11
      };

      axios
        .post("https://gihoon.glitch.me/auth/register", send_param)
        .then(returnData =>{
            console.log(returnData);
        })
      //에러
        .catch(err => {
          console.log(err);
        });
    }


    const gihoon2 = ()=>{
      const send_param = {
        username:11,
        registerNumber:11
      };

      axios
        .post("https://gihoon.glitch.me/auth/confirmregister", send_param)
        .then(returnData =>{
            console.log(returnData);
        })
      //에러
        .catch(err => {
          console.log(err);
        });
    }

    const qrcode = ()=>{
      
      let str = "https://gihoon.glitch.me/auth/register"

      QRCode.toCanvas(document.getElementById('canvas'), str,function(error) {
        if (error) console.error(error)
        //console.log('success!')
      })
    }
    
    const divStyle = {
      margin: 50
    };

  return (
    <div>
      <div style={divStyle}>
        <button onClick={goFido}>
            인증하기
        </button>
        <br/>
        <br/>
        <button onClick={gihoon}>gihoon 요청</button>
        <br/>
        <button onClick={gihoon2}>gihoon2 요청</button>
        <br/>
        <button onClick={qrcode}>QRcode</button>
      </div>
    </div>
  );
}

export default AuthForm;
