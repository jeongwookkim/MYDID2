import React from "react";
import MypageForm from "./MypageForm";
import LoginForm from "./LoginForm";
import BoardForm from "./BoardForm";
import AuthForm from "./AuthForm";
import BoardWriteForm from "./BoardWriteForm";
import BoardDetail from "./BoardDetail";
import { Route } from "react-router-dom";

function Body() {
  let resultForm;
  function getResultForm() {

    if (sessionStorage.getItem('login_id')) {
      if (sessionStorage.getItem('auth') === '2') {
        resultForm = <Route exact path="/" component={BoardForm}></Route>;
        return resultForm;
      } else if(sessionStorage.getItem('auth') === '0' || sessionStorage.getItem('auth') === '1') {
        resultForm = <Route exact path="/" component={AuthForm}></Route>;
        return resultForm;
      }
    } else {
      resultForm = <Route exact path="/" component={LoginForm}></Route>;
      return resultForm;
    }
  }
  getResultForm();

  return (
    <div>
      <Route path="/mypage" component={MypageForm}></Route>
      <Route path="/boardWrite" component={BoardWriteForm}></Route>
      <Route path="/board/detail" component={BoardDetail}></Route>
      {resultForm}
    </div>
  );
}

export default Body;
