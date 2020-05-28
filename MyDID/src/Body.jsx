import React from "react";
import LoginForm from "./LoginForm";
import BoardForm from "./BoardForm";
import AuthForm from "./AuthForm";
import BoardWriteForm from "./BoardWriteForm";
import BoardDetail from "./BoardDetail";
import MypageForm from "./MypageForm";
import { Route } from "react-router-dom";
import $ from "jquery";
import {} from "jquery.cookie";
import { Jumbotron, Form, Button, Image } from "react-bootstrap";

function Body() {
  let resultForm;
  function getResultForm() {
    if ($.cookie("login_id") !== undefined) {
      console.log("logined");
      console.log($.cookie("auth_ok"));
      console.log($.cookie("auth_ok") === "1234567890");
      if ($.cookie("auth_ok") !== undefined) {
        resultForm = <Route exact path="/" component={BoardForm}></Route>;
        return resultForm;
      } else {
        resultForm = <Route exact path="/" component={AuthForm}></Route>;
        return resultForm;
      }
    } else {
      resultForm = <Route exact path="/" component={LoginForm}></Route>;
      return resultForm;
    }
  }
  getResultForm();

  const padding = {
    padding: 20,
  };

  const icon = {
    position: "relative",
    backgroundPosition: "center",
    height: "62px",
  };
  const border = {
    marginTop: 20,
  };

  return (
    <div>
      <section className="page-section bg-secondary" id="about">
        <div className="container" style={padding}>
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <h2 className="text-white mt-0">
                게시판에 악플러들은 고소할수있으니 마음껏 이야기 나누세요
              </h2>
              <hr className="divider light my-4" />
              <p className="text-white-50 mb-4"></p>
            </div>
          </div>
        </div>
      </section>
      <section className="page-section" id="services">
        <div className="container" style={border}>
          <h2 className="text-center mt-0">At Your Service</h2>
          <hr className="divider my-4" />
          <div className="row">
            <div className="col-lg-3 col-md-6 text-center">
              <div className="mt-5">
                <i className="fas fa-4x fa-gem text-primary mb-4"></i>
                <Image style={icon} src="/img/111V.jpg"></Image>
                <h3 className="h4 mb-2" style={padding}>
                  {/* 화상회의 */}
                </h3>
                <p className="text-muted mb-0">
                  {/* 간편하게<br></br> 화상회의를 할수있습니다! */}
                </p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 text-center">
              <div className="mt-5">
                <i className="fas fa-4x fa-laptop-code text-primary mb-4"></i>
                <Image style={icon} src="/img/123.jpg"></Image>
                <h3 className="h4 mb-2" style={padding}>
                  {/* 채팅 */}
                </h3>
                <p className="text-muted mb-0">
                  {/* 회의와 함께 <br></br>채팅이 가능합니다! */}
                </p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 text-center">
              <div className="mt-5">
                <i className="fas fa-4x fa-globe text-primary mb-4"></i>
                <Image style={icon} src="/img/1234.jpg"></Image>
                <h3 className="h4 mb-2" style={padding}>
                  {/* 문서교환 */}
                </h3>
                <p className="text-muted mb-0">{/* 게시판 */}</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 text-center">
              <div className="mt-5">
                <i className="fas fa-4x fa-heart text-primary mb-4"></i>
                <Image style={icon} src="/img/aa.jpg"></Image>
                <h3 className="h4 mb-2" style={padding}>
                  {/* 무료 사용 */}
                </h3>
                <p className="text-muted mb-0">
                  {/* 어려운 시기 우리 MOA는 <br></br>여러분에게 화상회의를
                  <br></br>무료로 제공합니다. */}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Route path="/mypage" component={MypageForm}></Route>
      <Route path="/boardWrite" component={BoardWriteForm}></Route>
      <Route path="/board/detail" component={BoardDetail}></Route>
      {resultForm}
    </div>
  );
}

export default Body;
