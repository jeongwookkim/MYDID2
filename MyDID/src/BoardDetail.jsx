import React, { useState, useEffect, useRef, useCallback } from "react";
import { Table, Button, Image, Form } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import axios from "axios";
axios.defaults.withCredentials = true;
const headers = { withCredentials: true };

const boardStyle={
  margin: 5,
  //backgroundPosition: "center",
}

//게시글 삭제 컴포넌트
function RemoveModifyBtn(props) {
  console.log(props._id+" : "+ props.content);
  return (
    <tr>
      <td>
      <NavLink
          to={{ pathname: "/BoardWrite", query: {_id:props._id, title:props.title, content:props.content}}}>
        <Button
          variant="outline-secondary"
          block
          style={boardStyle}
        >
          글 수정
        </Button>
      </NavLink>
        <Button
          variant="outline-danger"
          block
          style={boardStyle}
          onClick={props.deleteBoard}
        >
          글 삭제
        </Button>
      </td>
    </tr>
  );
}
//댓글 ROW 컴포넌트
function CommentRow(props) {
  console.log(props.comment.writer.name);
  return (
    <tr>
      <td>{props.comment.writer.name}</td>
      <td>{props.comment.comment}</td>
      <td>
        <Button variant="outline-danger" onClick={() => props.removeComment(props.comment._id)}>
          삭제
        </Button>
      </td>
    </tr>
  );
}

//댓글 컴포넌트
function CommentList(props) {
  const divStyle = {
    //width: 900,
    margin: 50,
  };

  return (
    <div style={divStyle}>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th width="120">댓글작성자</th>
            <th>댓글내용</th>
            <th width="100">삭제</th>
          </tr>
        </thead>
        <tbody>
          {props.comments.map((comment) => (
            <CommentRow
              comment={comment}
              key={comment._id}
              removeComment={props.removeComment}
            />
          ))}
        </tbody>
      </Table>
    </div>
  );
}

//게시판 상세페이지 컴포넌트
function BoardDetail(props) {
  const [board, setBoard] = useState([]);
  const [comments, setComments] = useState(false);
  const [flag, setFlag] = useState(true);
  const commentTitle = useRef();

  const getCommentList = useCallback(() => {
    axios
      .post(process.env.REACT_APP_URL+"/board/detail", "")
      .then(async (returnData) => {
        if (returnData.data.comment.length > 0) {
          setComments(returnData.data.comment);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  //게시글 상세정보 가져오기
  const getDetail = useCallback(() => {
    const send_param = {
      headers,
      _id: props.location.query._id,
    };
    // const marginBottom = {
    //   marginBottom: 5,
    //   width: 90,
    // };
    const imageStyle = {
      textAlign : "center"
    }

    axios
      .post(process.env.REACT_APP_URL+"/board/detail", send_param)
      //정상 수행
      .then(async (returnData) => {
        if (returnData.data.board[0]) {
          if (returnData.data.comment.length > 0) {
            console.log(returnData.data.comment.length);
            const comment = returnData.data.comment;
            await setComments(comment);
          }
          const board = (
            <div>
              {returnData.data.board[0].imgPath !== undefined? (
              <div style={imageStyle}>
              <Image src={process.env.REACT_APP_URL + "/upload/" +returnData.data.board[0].imgPath} fluid /> 
              </div>
              ): ""}
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>{returnData.data.board[0].title}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{returnData.data.board[0].content}</td>
                  </tr>
                {/* //////////////////////삼항연산자//////////////////////////// */}
                {props.location.query.writer === sessionStorage.getItem('login_id') ? (
                  <RemoveModifyBtn
                    _id={props.location.query._id}
                    title={returnData.data.board[0].title}
                    content = {returnData.data.board[0].content}
                    updateBoard={updateBoard.bind(
                      null,
                      props.location.query._id, props.location.query.writer
                    )}
                    deleteBoard={deleteBoard.bind(null, props.location.query._id, props.location.query.writer)}
                  />
                ) : (
                  ""
                )}
                </tbody>
              </Table>
            </div>
          );
          await setBoard(board);
          setFlag(false);
        } else {
          alert("글 상세 조회 실패");
        }
      })
      //에러
      .catch((err) => {
        console.log(err);
      });
  }, [props.location.query, setComments]);

  //게시판 상세 세팅(초기 랜더링시)
  const setBoardDetail = useCallback(() => {
    if (props.location.query !== undefined) {
      getDetail();
    } else {
      window.location.href = "/";
    }
  }, [props.location.query, getDetail]);

  useEffect(() => {
    if (flag) {
      console.log("flag=" + flag);
      setBoardDetail();
    }
  }, [flag, setBoardDetail]);

  //게시글 수정
  const updateBoard = (_id) => {
    console.log("update : "+_id);
    const send_param = {
      headers,
      _id,
    };

    if (window.confirm("수정 하시겠습니까?")) {
      axios
        .post(process.env.REACT_APP_URL+"/board/update", send_param)
        //정상 수행
        .then((returnData) => {
          alert(returnData.data.data);
        })
        //에러
        .catch((err) => {
          console.log(err);
          alert("글 수정 실패");
        });
    }
  };

  //게시글 삭제
  const deleteBoard = (_id, writer) => {

    //alert(writer);
    const send_param = {
      headers,
      _id,
      writer,
    };

    if (window.confirm("정말 삭제하시겠습니까?")) {
      axios
        .post(process.env.REACT_APP_URL+"/board/delete", send_param)
        //정상 수행
        .then((returnData) => {
          alert(returnData.data.message);
          window.location.href = "/";
        })
        //에러
        .catch((err) => {
          console.log(err);
          alert("글 삭제 실패");
        });
    }
  };

  //댓글 삭제
  const removeComment = useCallback(
    (_id) => {
      const send_param = {
        headers,
        _id,
      };
      axios
        .post(process.env.REACT_APP_URL +"/comment/delete", send_param)
        .then((returnData) => {
          alert(returnData.data.message);
          setComments(returnData.data.comment);
          if(returnData.data.refresh){
            setComments(comments);
          }else{
            setComments(comments.filter((comment) => comment._id !== _id));
          }
        })
        .catch((err) => {
          console.log(err);
          alert("글 삭제 실패");
        });
    },
    [setComments, comments]
  );

  //댓글 등록
  const writeComment = useCallback(() => {
    //const formData = new FormData();
    const send_param = {
      headers,
      _id: props.location.query._id,
      _comment: commentTitle.current.value,
    };
    axios.post(process.env.REACT_APP_URL+"/comment/writecomment", send_param)
    .then((returnData)=>{
      alert(returnData.data.message);
    })

    getCommentList();
  }, [props.location.query, getCommentList]);

  const titleStyle = {
    marginBottom: 5,
    //width: 900,
  };
  const buttonStyle = {
    marginBottom: 5,
    width: 100,
  };
  const divStyle = {
    margin: 50,
  };

  const divStyle2 = {
    //justifyContent: "space-around",
    display: "flex",
    //width: 800,
    margin: 50,
  };

  return (
    <>
      <div style={divStyle}>{board}</div>
      <div style={divStyle2} /*  class="justify-content-center" */>
        <Form.Control
          type="text"
          style={titleStyle}
          placeholder="댓글쓰기"
          ref={commentTitle}
          maxLength="64"
        />
        <Button style={buttonStyle} block onClick={writeComment} variant="outline-secondary">
          댓글작성
        </Button>
      </div>
      {comments ? (
        <CommentList comments={comments} removeComment={removeComment} />
      ) : (
        ""
      )}
    </>
  );
}

export default BoardDetail;
