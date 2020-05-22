import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import axios from "axios";
import $ from "jquery";
import {} from "jquery.cookie";
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

    const divStyle = {
      margin: 50
    };

  return (
    <div>
      <div style={divStyle}>
        <button onClick={goFido}>
            인증하기
        </button>
      </div>
    </div>
  );
}

export default AuthForm;
