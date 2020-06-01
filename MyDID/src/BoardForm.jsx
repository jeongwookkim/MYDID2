import React, { useState, useEffect } from "react";
import { Jumbotron, Form, Button, Image, Table } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import axios from "axios";
import $ from "jquery";
import {} from "jquery.cookie";

axios.defaults.withCredentials = true;
const headers = { withCredentials: true };

function BoardRow(props) {

  return (
    <tr>
      <td>
        <NavLink to={{ pathname: "/board/detail", query: { _id: props._id, writer: props.writer } }}>
          {props.createdAt.substring(0, 10)}
        </NavLink>
      </td>
      <td>
        <NavLink to={{ pathname: "/board/detail", query: { _id: props._id, writer: props.writer } }}>
          {props.title}
        </NavLink>
      </td>
      <td>
        <NavLink to={{ pathname: "/board/detail", query: { _id: props._id, writer: props.writer } }}>
          {props.name}
        </NavLink>
      </td>
    </tr>
  );
}

function BoardForm(props) {
  const [boardList, setBoardList] = useState();

  useEffect(() => {
    getBoardList();
  }, []);

  const getBoardList = () => {
    const send_param = {
      headers,
      _id: sessionStorage.getItem('login_id'),
      email:sessionStorage.getItem('login_email')
    };

    axios
      .post("http://localhost:8080/board/getBoardList", send_param)
      .then((returnData) => {
        if (returnData.data.list.length > 0) {
          //console.log(returnData.data.list.login_email);
          console.log(returnData.data.list);
          const boards = returnData.data.list;
          const boardContents = boards.map((item) => (
            <BoardRow
              key={Date.now() + Math.random() * 500}
              _id={item._id}
              createdAt={item.createdAt}
              title={item.title}
              name={item.writer.name}
              writer={item.writer._id}
              //email={item.writer.email}
            ></BoardRow>
          ));
          // console.log(boardList);
          setBoardList(boardContents);
        } else {
          const boardList = (
            <tr>
              <td colSpan="3">작성한 게시글이 존재하지 않습니다.</td>
            </tr>
          );
          setBoardList(boardList);
          // window.location.reload();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const divStyle = {
    margin: 50,
  };

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

      <div style={divStyle}>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>날짜</th>
              <th>글 제목</th>
              <th>작성자</th>
            </tr>
          </thead>
          <tbody>{boardList}</tbody>
        </Table>
      </div>
    </div>
  );
}

export default BoardForm;
