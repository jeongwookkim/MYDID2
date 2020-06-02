import React, { useState, useEffect } from "react";
import { Button, Image } from "react-bootstrap";
import axios from "axios";
import { useQrious } from 'react-qrious';

axios.defaults.withCredentials = true;
const headers = { withCredentials: true };

function logoutSession() {
  axios
    .get(process.env.REACT_APP_URL+"/member/logout", { headers })
    .then((returnData) => {
      if (returnData.data.message) {
        sessionStorage.clear();
        window.location.reload();
      }
    });
}

//DID 등록 및 인증 폼 컴포넌트
function AuthForm(){
  const [value] = useState('https://mydid.kro.kr');
  const [dataUrl] = useQrious({ value });
  const [returnCode, setReturnCode] = useState();

  //최초 렌더링 완료시 
   useEffect(()=>{
    loginMyDID();
  },[]);

  //MyDID 인증 확인 버튼 클릭시
  const loginMyDID = ()=>{
    const send_param = {
      headers
    };

    axios
      .post(process.env.REACT_APP_URL+"/auth/registersignin", send_param)
      .then(returnData =>{
        //인증등록이 되어있을 경우 MyDID 인증 성공
        if(returnData.data.returnCode === "1"){
          setReturnCode(returnData.data.returnCode);
          sessionStorage.setItem('auth', "2");
          window.location.reload();
        //Timeout
        }else if(returnData.data.returnCode === "2"){
          setReturnCode(returnData.data.returnCode);
          alert(returnData.data.message);
          logoutSession();
        //인증 등록이 되어있지 않은 경우
        }else if(returnData.data.returnCode === "0"){
          setReturnCode(returnData.data.returnCode);
        //기타 오류 발생시
        }else{
          logoutSession();
        }
      })
    //에러
    .catch(err => {
      // console.log(err);
      logoutSession();
      window.location.reload();
    });
  }

  const imageStyle = {
    margin: 20,
    textAlign: "center"
  }
  const imageSize = {
    width : 300,
    height : 300
  }

  const buttonStyle = {
    width : 300,
    height : 100,
    marginBottom : 20,
  }

  //MyDID 등록이 되어있지 않을 경우
  if(returnCode === undefined){
    return (
      <>
        <h1 style={imageStyle}>MyDID 비인증 회원입니다.</h1>
        <div style={imageStyle}>
          <Image style={imageSize} src={dataUrl} />
          <div style={imageStyle}>
            <h3>스마트폰 QR코드를 통해 MyDID 웹사이트에서 MyDID 등록 후 '인증 요청' 버튼을 눌러주세요.</h3><br/>
            <Button variant="secondary" style={buttonStyle} onClick={loginMyDID}>인증 요청</Button>
          </div>
        </div>
      </>
    );
  }else{
    return(
      <>
        <h1 style={imageStyle}>회원가입 시 휴대전화 번호로 MyDID 인증 요청 되었습니다.</h1>
        <div style={imageStyle}>
          <Image style={imageSize} src={dataUrl}/><br/>
          <h3 style={imageStyle}>스마트폰 QR코드를 통해 MyDID 웹사이트에서 생체인증 절차를 진행해주시기 바랍니다.</h3>
          <Button variant="secondary" style={buttonStyle} onClick={loginMyDID}>재인증 요청</Button>
          <h3>생체인증 절차를 진행한 이후에도 1~2분간 반응이 없을 경우 '재인증 요청' 버튼을 눌러주세요.</h3>
        </div>
      </>
    )
  }
}

export default AuthForm;
