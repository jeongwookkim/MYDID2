import React, { useEffect, useRef, Component } from "react";
import { Jumbotron, Form, Button, Image } from "react-bootstrap";
import { loadReCaptcha, ReCaptcha } from "react-recaptcha-v3";
import axios from "axios";
import $ from "jquery";
import {} from "jquery.cookie";
axios.defaults.withCredentials = true;
const headers = { withCredentials: true };

function LoginForm() {
  const joinEmail = useRef();
  const joinName = useRef();
  const joinPw = useRef();
  const loginEmail = useRef();
  const loginPw = useRef();
  const phoneNumber = useRef();

  useEffect(() => {
    loadReCaptcha("6LfGieAUAAAAAJSOoqXS5VQdT_e5AH8u0n2e1PDb");
  }, []);
  const verifyCallback = (recaptchaToken) => {
    // Here you will get the final recaptchaToken!!!
    console.log(recaptchaToken, "<= your recaptcha token");
  };
  const join = () => {
    /* const regExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;

  const regExp2 = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,16}$/;

  if (joinEmail.current.value === "" || joinEmail.current.value === undefined) {

   alert("이메일 주소를 입력해주세요.");

   joinEmail.current.focus();

   return;

  } else if (

   joinEmail.current.value.match(regExp) === null ||

   joinEmail.current.value.match(regExp) === undefined

  ) {

   alert("이메일 형식에 맞게 입력해주세요.");

   joinEmail.current.value = "";

   joinEmail.current.focus();

   return;

  } else if (joinName.current.value === "" || joinName.current.value === undefined) {

   alert("이름을 입력해주세요.");

   joinName.current.focus();

   return;

  } else if (joinPw.current.value === "" || joinPw.current.value === undefined) {

   alert("비밀번호를 입력해주세요.");

   joinPw.current.focus();

   return;

  } else if (

   joinPw.current.value.match(regExp2) === null ||

   joinPw.current.value.match(regExp2) === undefined

  ) {

   alert("비밀번호를 숫자와 문자, 특수문자 포함 8~16자리로 입력해주세요.");

   joinPw.current.value = "";

   joinPw.current.focus();

   return;

  } else if(phoneNumber.current.value === null || phoneNumber.current.value ===  undefined){
      alert('휴대전화 번호를 입력해주세요.');
      return;
  } */

    const send_param = {
      headers,
      email: joinEmail.current.value,
      name: joinName.current.value,
      password: joinPw.current.value,
      phoneNumber: phoneNumber.current.value
    };

    axios
      .post(process.env.REACT_APP_URL+"/member/join", send_param)
      //정상 수행
      .then((returnData) => {
        if (returnData.data.message) {
          alert(returnData.data.message);

          //이메일 중복 체크
          if (returnData.data.dupYn === "1") {
            joinEmail.current.value = "";
            joinEmail.current.focus();
          } else {
            joinEmail.current.value = "";
            joinName.current.value = "";
            joinPw.current.value = "";
            phoneNumber.current.value = "";
          }
        } else {
          alert("회원가입 실패");
        }
      })
      //에러
      .catch((err) => {
        console.log(err);
      });
  };

  const name = () => {
    alert("인증완료 ");
  };

  const login = () => {
    if (
      loginEmail.current.value === "" ||
      loginEmail.current.value === undefined
    ) {
      alert("이메일 주소를 입력해주세요.");
      loginEmail.current.focus();
      return;
    } else if (
      loginPw.current.value === "" ||
      loginPw.current.value === undefined
    ) {
      alert("비밀번호를 입력해주세요.");
      loginPw.current.focus();
      return;
    }

    const send_param = {
      headers,
      email: loginEmail.current.value,
      password: loginPw.current.value,
    };

    axios
      .post(process.env.REACT_APP_URL+"/member/login", send_param)

      //정상 수행
      .then((returnData) => {
        if (returnData.data.message) {
          // console.log("login_id:" + returnData.data._id);
          sessionStorage.setItem('login_id', returnData.data._id);
          sessionStorage.setItem('login_email', returnData.data.email);
          sessionStorage.setItem('auth', returnData.data.auth);
          alert(returnData.data.message);
          window.location.reload();
        } else {
          alert(returnData.data.message);
        }
      })
      //에러
      .catch((err) => {
        console.log(err);
      });
  };
  const divStyle = {
    display: "flex",
    justifyContent: "space-around",
    backgroundImage: "url(/img/lock3.jpg)",
    backgroundSize: "100% 100%",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    position: "relative",
    height: "45vw",
  };
  const buttonStyle = {
    marginTop: 10,
  };
  const ImgStyle3 = {
    backgroundImage: "url(/img/1233.jpg)",
    backgroundSize: "100% 100%",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    position: "relative",
    height: "45vw",
  };
  const ImgStyle2 = {
    backgroundImage: "url(/img/12342.jpg)",
    backgroundSize: "100% 100%",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    position: "relative",
    height: "45vw",
  };
  /*   const icon = {
    position: "relative",
    backgroundPosition: "center",
    height: "62px",
  }; */
  const border = {
    marginTop: 20,
  };
  const padding = {
    padding: 20,
  };
  return (
    <>
            
      <div style={divStyle}>
        <Jumbotron style={{ opacity: 0.9 }} className="float-right my-4 mr-5">
          <Form controlId="joinForm">
            <h3>회원가입</h3>

            <Form.Label>Email address</Form.Label>

            <Form.Control
              type="email"
              maxLength="100"
              ref={joinEmail}
              placeholder="Enter email"
            />

            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
            <Form.Label>name</Form.Label>

            <Form.Control
              type="text"
              maxLength="20"
              ref={joinName}
              placeholder="name"
            />

            <Button
              style={buttonStyle}
              onClick={name}
              variant="secondary"
              type="button"
              block
            >
              실명인증
            </Button>

            <Form.Label>Password</Form.Label>

            <Form.Control
              type="password"
              maxLength="64"
              ref={joinPw}
              placeholder="Password"
            />

            <Form.Label>phone number</Form.Label>

            <Form.Control
              type="text"
              maxLength="64"
              ref={phoneNumber}
              placeholder="phone number"
            />

            <Button
              style={buttonStyle}
              onClick={join}
              variant="secondary"
              type="button"
              block
            >
              회원가입
            </Button>
          </Form>
        </Jumbotron>

        <Jumbotron style={{ opacity: 0.9 }} className="float-right my-4 mr-5">
          <Form controlId="loginForm">
            <h3>로그인</h3>

            <Form.Label>Email address</Form.Label>

            <Form.Control
              type="email"
              maxLength="100"
              ref={loginEmail}
              placeholder="Enter email"
            />

            <Form.Label>Password</Form.Label>

            <Form.Control
              type="password"
              maxLength="20"
              ref={loginPw}
              placeholder="Password"
            />

            <ReCaptcha
              sitekey="6LfGieAUAAAAAJSOoqXS5VQdT_e5AH8u0n2e1PDb"
              action="login"
              verifyCallback={verifyCallback}
            />

            <Button
              style={buttonStyle}
              onClick={login}
              variant="secondary"
              type="button"
              block
            >
              로그인
            </Button>
          </Form>
        </Jumbotron>
      </div>
      <section className="page-section bg-secondary" id="about">
        <div className="container" style={padding}>
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <h2 className="text-white mt-0">
                악플이 달려서 맘이 상하셨나요?<br></br>그런 개자석들의
                신상정보가 궁금하시다구요?
              </h2>
              <hr className="divider light my-4" />
              <p className="text-white-50 mb-4">
                본인확인을 한후에 게시판에 접속할수있습니다.
                <br></br>
                보쌈나라 민경공주 게시판에서는 신상정보를 찾을수 있습니다.
                악플러들을 고소를 하세요!
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* <section className="page-section" id="services">
        <div className="container" style={border}>
          <h2 className="text-center mt-0">At Your Service</h2>
          <hr className="divider my-4" />
          <div className="row">
            <div className="col-lg-3 col-md-6 text-center">
              <div className="mt-5">
                <i className="fas fa-4x fa-gem text-primary mb-4"></i>
                <Image style={icon} src="/img/videoconference.png"></Image>
                <h3 className="h4 mb-2" style={padding}>
                  화상회의
                </h3>
                <p className="text-muted mb-0">
                  간편하게<br></br> 화상회의를 할수있습니다!
                </p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 text-center">
              <div className="mt-5">
                <i className="fas fa-4x fa-laptop-code text-primary mb-4"></i>
                <Image style={icon} src="/img/chat.png"></Image>
                <h3 className="h4 mb-2" style={padding}>
                  채팅
                </h3>
                <p className="text-muted mb-0">
                  회의와 함께 <br></br>채팅이 가능합니다!
                </p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 text-center">
              <div className="mt-5">
                <i className="fas fa-4x fa-globe text-primary mb-4"></i>
                <Image style={icon} src="/img/result.png"></Image>
                <h3 className="h4 mb-2" style={padding}>
                  문서교환
                </h3>
                <p className="text-muted mb-0">
                  게시판
                </p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 text-center">
              <div className="mt-5">
                <i className="fas fa-4x fa-heart text-primary mb-4"></i>
                <Image style={icon} src="/img/free.png"></Image>
                <h3 className="h4 mb-2" style={padding}>
                  무료 사용
                </h3>
                <p className="text-muted mb-0">
                  어려운 시기 우리 MOA는 <br></br>여러분에게 화상회의를
                  <br></br>무료로 제공합니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section> */}
      <Jumbotron style={ImgStyle2}></Jumbotron>
      <section className="page-section" id="services">
        <div className="container" style={border}>
          <br></br>

          <hr className="divider my-4" />
          <h2 className="text-center mt-0">
            {" "}
            악플러들에게 인생은 실전이다 X만아를 보여주세요<br></br>
            <br></br>
            피해자와 피의자의 신원이 특정이 되어 고소가 수월합니다
          </h2>
          <hr className="divider my-4" />

          <div className="row">
            <div className="col-lg-3 col-md-6 text-center">
              <div className="mt-5">
                <i className="fas fa-4x fa-gem text-primary mb-4"></i>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Jumbotron style={ImgStyle3}></Jumbotron>
      <section className="page-section bg-secondary" id="about">
        <div className="container" style={padding}>
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <h2 className="text-white mt-0">
                서로의 신원확인이 가능하기에<br></br>깨끗한 게시판 보쌈나라
                민경공주가 있습니다. <br></br>많은 분들이 사용하는 모습을
                보세요!
              </h2>
              <hr className="divider light my-4" />
              <p className="text-white-50 mb-4">
                상스럽게 욕하는 사람들과 굳이 대화하며 친해지지마세요.
                <br></br>
                수준에 맞는 사람과 함께하는 게시판을 사용하세요
              </p>
            </div>
          </div>
        </div>
      </section>
      <section id="portfolio">
        <div className="container-fluid p-0">
          <div className="row no-gutters">
            <div className="col-lg-4 col-sm-6">
              <a
                className="portfolio-box"
                href="assets/img/portfolio/fullsize/1.jpg"
              >
                <img className="img-fluid" src="/img/q1.jpg" alt="" />
                <div className="portfolio-box-caption"></div>
              </a>
            </div>
            <div className="col-lg-4 col-sm-6">
              <a
                className="portfolio-box"
                href="assets/img/portfolio/fullsize/2.jpg"
              >
                <img className="img-fluid" src="/img/q2.jpg" alt="" />
                <div className="portfolio-box-caption"></div>
              </a>
            </div>
            <div className="col-lg-4 col-sm-6">
              <a
                className="portfolio-box"
                href="assets/img/portfolio/fullsize/3.jpg"
              >
                <img className="img-fluid" src="/img/q3.jpg" alt="" />
                <div className="portfolio-box-caption"></div>
              </a>
            </div>
            <div className="col-lg-4 col-sm-6">
              <a
                className="portfolio-box"
                href="assets/img/portfolio/fullsize/4.jpg"
              >
                <img className="img-fluid" src="/img/q4.jpg" alt="" />
                <div className="portfolio-box-caption"></div>
              </a>
            </div>
            <div className="col-lg-4 col-sm-6">
              <a
                className="portfolio-box"
                href="assets/img/portfolio/fullsize/5.jpg"
              >
                <img className="img-fluid" src="/img/q7.jpg" alt="" />
                <div className="portfolio-box-caption"></div>
              </a>
            </div>
            <div className="col-lg-4 col-sm-6">
              <a
                className="portfolio-box"
                href="assets/img/portfolio/fullsize/6.jpg"
              >
                <img className="img-fluid" src="/img/q9.jpg" alt="" />
                <div className="portfolio-box-caption p-3"></div>
              </a>
            </div>
          </div>
        </div>
      </section>
      <section className="page-section" id="contact">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <h2 className="mt-0">Let's Get In Touch!</h2>
              <hr className="divider my-4" />
              <p className="text-muted mb-5">
                Ready to start your next project with us? Give us a call or send
                us an email and we will get back to you as soon as possible!
              </p>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-4 ml-auto text-center mb-5 mb-lg-0">
              <i className="fas fa-phone fa-3x mb-3 text-muted"></i>
              <div>010-6893-3537</div>
            </div>
            <div className="col-lg-4 mr-auto text-center">
              <i className="fas fa-envelope fa-3x mb-3 text-muted"></i>
              <a className="d-block" href="mailto:contact@yourwebsite.com">
                mybiggold@naver.com
              </a>
            </div>
          </div>
          <br></br>
          <br></br>
        </div>
      </section>
      <footer className="bg-light py-5">
        <div className="container">
          <div className="small text-center text-muted">
            Copyright © 2020 - 족발나라 민경공주
          </div>
        </div>
      </footer>
    </>
  );
}

export default LoginForm;
