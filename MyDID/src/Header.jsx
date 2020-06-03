import React, { useState, useEffect } from "react";
import { Navbar, Button, Image } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import axios from "axios";
axios.defaults.withCredentials = true;
const headers = { withCredentials: true };

function Header() {
  const [buttonDisplay, setButtonDisplay] = useState("none");
  const [logoutButtonDisplay, setLogoutButtonDisplay] = useState("none");

  useEffect(() => {
    getButtonStyle();
  }, []);

  function getButtonStyle() {
    if (sessionStorage.getItem('auth') === '2') {
      setButtonDisplay("block");
      setLogoutButtonDisplay("block");
    } else {
      if(sessionStorage.getItem('auth') === '1' || sessionStorage.getItem('auth') === '0'){
        setLogoutButtonDisplay("block");
      }
      setButtonDisplay("none");
    }
  }

  function logout() {
    axios
      .get(process.env.REACT_APP_URL+"/member/logout", { headers })
      .then((returnData) => {
        if (returnData.data.message) {
          sessionStorage.clear();
          alert("로그아웃 되었습니다!");
          window.location.href = "/";
        }
      });
  }

  const buttonStyle = {
    margin: "0px 5px 0px 10px",
    display: buttonDisplay,
  };

  const logoutButtonStyle = {
    margin: "0px 5px 0px 10px",
    display: logoutButtonDisplay,
  };

  const divStyle = {
    justifyContent: "space-around",
    backgroundColor: "black",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    position: "relative",
  };

  return (
    <div style={divStyle}>
      <Image src="./img/mydid-logo2.png" width="300px" />
      <Navbar>
        ​ <Navbar.Brand href="/"></Navbar.Brand>
        ​ <Navbar.Toggle />​{" "}
        <Navbar.Collapse className="justify-content-end">
          ​{" "}
          {/* <NavLink to="/mypage">
​      <Button style={buttonStyle} variant="primary">
​       회원정보 수정
​      </Button>
​     </NavLink> */}
          ​{" "}
          <NavLink to="/">
            ​{" "}
            <Button style={buttonStyle} variant="secondary">
              ​ 글목록 ​{" "}
            </Button>
            ​{" "}
          </NavLink>
          ​{" "}
          <NavLink to="/boardWrite">
            ​{" "}
            <Button style={buttonStyle} variant="secondary">
              ​ 글쓰기 ​{" "}
            </Button>
            ​{" "}
          </NavLink>
          ​{" "}
          <Button style={logoutButtonStyle} onClick={logout} variant="danger">
            ​ 로그아웃 ​{" "}
          </Button>
          ​{" "}
        </Navbar.Collapse>
      </Navbar>
      {/* <Image src="./img/main.png" fluid /> */}
    </div>
  );
}

export default Header;
