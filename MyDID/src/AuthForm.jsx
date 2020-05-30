import React, { useState, useEffect, useRef } from "react";
import { Form, Button, Image } from "react-bootstrap";
import axios from "axios";
import $ from "jquery";
import {} from "jquery.cookie";
import { useQrious } from 'react-qrious';

axios.defaults.withCredentials = true;
const headers = { withCredentials: true };

function MyDIDConfirmForm(props){
  return(
      <>
        <Image src={props.dataUrl} />
        <div>
          <Form.Label>QR코드를 통해 MyDID 어플리케이션을 설치해주시고 MyDID 등록과 인증절차를 진행해주시기 바랍니다.</Form.Label>
        </div>
        <Button
          onClick={props.action}
          variant="secondary"
          type="button"
          block
        >
          확인
        </Button>
      </>
  );
}

//DID 등록 및 인증 폼 컴포넌트
function AuthForm(){
  const username = useRef();
  const registerNumber = useRef();
  const [myDIDConfirmForm, setMyDIDConfirmForm] = useState();  
  const [value, setValue] = useState('https://play.google.com/store/apps/details?id=com.hamletshu.mydid.fido2');
  const [dataUrl, setDataURL] = useQrious({ value });

  //최초 렌더링 완료시 이메일 세팅
  useEffect(()=>{
    username.current.value = $.cookie("login_email");
  },[]);

  //MyDID 최초 발급 시 인증하기 버튼 클릭시 계정 생성
  const insertMyDID = () =>{
    const send_param = {
      headers,
      username: $.cookie("login_email"),
      registerNumber: registerNumber.current.value
    };

    axios
      .post("https://mydid.kro.kr/auth/register", send_param)
      .then(returnData =>{
        if (returnData.data.message) {
          alert(returnData.data.message);
          setMyDIDConfirmForm(<MyDIDConfirmForm action={insertConfirmMyDID} dataUrl={dataUrl}/>);
        } else {
          alert(returnData.data.message);
        }
      })
    //에러
      .catch(err => {
        console.log(err);
      });
  }
  
  //계정 생성 이후 인증번호 입력 후 확인버튼 클릭시 인증확인
  const insertConfirmMyDID = ()=>{
    const send_param = {
      headers,
      username: $.cookie("login_email"),
      registerNumber: registerNumber.current.value
    };
    
    axios
    .post("https://mydid.kro.kr/auth/confirmregister", send_param)
    .then(returnData =>{
      if(returnData.data.message){
        axios
        .post("http://localhost:8080/auth", send_param)
        .then(returnData2 =>{
          if (returnData2.data.message) {
            $.cookie("auth", returnData2.data.auth, { expires: 1 });
            alert(returnData.data.message);
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
    })
    //에러
    .catch(err => {
      console.log(err);
    });
  }
  
  //MyDID 발급 이후 인증하기 버튼 클릭시 서버 요청
  const loginMyDID = () =>{
    const send_param = {
      headers,
      username: $.cookie("login_email"),
      registerNumber: registerNumber.current.value
    };

    axios
      .post("https://mydid.kro.kr/auth/registersignin", send_param)
      .then(returnData =>{
        if (returnData.data.message) {
          alert(returnData.data.message);
          setMyDIDConfirmForm(<MyDIDConfirmForm action={loginConfirmMyDID} dataUrl={dataUrl}/>);
        } else {
          alert(returnData.data.message);
        }
      })
    //에러
      .catch(err => {
        console.log(err);
      });
  }

  //MyDID 인증확인 버튼 클릭시
  const loginConfirmMyDID = ()=>{
    const send_param = {
      headers,
      username: $.cookie("login_email"),
      registerNumber: registerNumber.current.value
    };

    axios
      .post("https://mydid.kro.kr/auth/confirmsiginin", send_param)
      .then(returnData =>{
        $.cookie("auth", '2', { expires: 1 });
        alert(returnData.data.message);
        window.location.reload();
      })
    //에러
    .catch(err => {
      console.log(err);
    });
  }

  const divStyle = {
    margin: 50
  };
  const buttonStyle = {
    marginTop: 10,
  };

  //MyDID 등록이 되어있지 않을 경우
  if($.cookie("auth") === "0"){
    return (
      <>
        <Form style={divStyle}>
          <h3>My DID 등록</h3>
          <Form.Label>아이디</Form.Label>
          <Form.Control
            type="text"
            maxLength="100"
            ref={username}
            placeholder="아이디"
            readOnly
          />
          <Form.Label>인증번호</Form.Label>
          <Form.Control
            type="password"
            maxLength="6"
            ref={registerNumber}
            placeholder="인증번호"
          />
          <Button
            style={buttonStyle}
            onClick={insertMyDID}
            variant="secondary"
            type="button"
            block
          >
            인증하기
          </Button>
          {myDIDConfirmForm}
        </Form>
      </>
    );
  }else{
  // MyDID 등록이 되어있을 경우
  return(
    <>
      <Form style={divStyle}>
        <h3>My DID 인증</h3>
        <Form.Label>아이디</Form.Label>
        <Form.Control
          type="text"
          maxLength="100"
          ref={username}
          placeholder="아이디"
          readOnly
        />
        <Form.Label>인증번호</Form.Label>
        <Form.Control
          type="password"
          maxLength="6"
          ref={registerNumber}
          placeholder="인증번호"
        />
        <Button
          style={buttonStyle}
          onClick={loginMyDID}
          variant="secondary"
          type="button"
          block
        >
          인증하기
        </Button>
        {myDIDConfirmForm}
      </Form>
    </>);
  }
}

export default AuthForm;
