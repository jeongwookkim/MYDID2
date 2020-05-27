import React, { useState, useEffect, useRef, useCallback } from "react";
import { Table, Button, Image ,Form } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import axios from "axios";
import $ from "jquery";
import {} from "jquery.cookie";
axios.defaults.withCredentials = true;
const headers = { withCredentials: true };

//댓글 ROW 컴포넌트
function CommentRow(props){
  return (
    <tr>
      <td>{props.comment.writer}</td>
      <td>{props.comment.comment}</td>
      <td>
        <button onClick={()=>props.removeComment(props.comment._id)}>삭제</button>
      </td>
    </tr>
  );
}

//댓글 컴포넌트
function CommentList(props){
  const divStyle = {
    margin: 50
  };
  return (
    <div style={divStyle}>
        <Table striped bordered hover>
            <thead>
              <tr>
              <th>댓글작성자</th>
              <th>댓글내용</th>
              <th>삭제</th>
              </tr>
            </thead>
            <tbody>
                {props.comments.map(comment => <CommentRow comment={comment} key={comment._id} removeComment={props.removeComment} />)}
            </tbody>
          </Table>
    </div>
    
  );
}

//게시판 상세페이지 컴포넌트
function BoardDetail(props){

  const [board, setBoard] = useState([]);
  const [comments, setComments] = useState(false);
  const [flag, setFlag] = useState(true);
  const boardTitle = useRef();

   const getCommentList = useCallback(() => {
    axios
      .post("http://localhost:8080/board/detail","")
      .then(async returnData => {
        if (returnData.data.comment.length > 0) {
          setComments(returnData.data.comment);
        }
      })
      .catch(err => {
        console.log(err);
      });


  },[]);

  //게시글 상세정보 가져오기
  const getDetail = useCallback(() => {
    const send_param = {
      headers,
      _id: props.location.query._id
    };
    const marginBottom = {
      marginBottom: 5
    };

    axios
      .post("http://localhost:8080/board/detail", send_param)
      //정상 수행
      .then(async returnData => {
        if (returnData.data.board[0]) {
          if (returnData.data.comment.length > 0) {
            console.log(returnData.data.comment.length);
            const comment = returnData.data.comment;
            await setComments(comment);
          }

          const board = (
            <div>
              {/* <Image src={process.env.REACT_APP_URL + returnData.data.board[0].imgPath} fluid /> */}
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
                </tbody>
              </Table>
              <div>
                <NavLink
                  to={{
                    pathname: "/boardWrite",
                    query: {
                      title: returnData.data.board[0].title,
                      content: returnData.data.board[0].content,
                      _id: props.location.query._id
                    }
                  }}
                >
                  <Button block style={marginBottom}>
                    글 수정
                  </Button>
                </NavLink>
                <Button
                  block
                  onClick={deleteBoard.bind(
                    null,
                    props.location.query._id
                  )}
                >
                  글 삭제
                </Button>
              </div>
            </div>
          );
          await setBoard(board);
          setFlag(false);
        } else {
          alert("글 상세 조회 실패");
        }
      })
      //에러
      .catch(err => {
        console.log(err);
      });
      
  },[props.location.query, setComments]);

  //게시판 상세 세팅(초기 랜더링시)
  const setBoardDetail = useCallback(() => {
    if (props.location.query !== undefined) {
      getDetail();
    } else {
      window.location.href = "/";
    }
  }, [props.location.query, getDetail]);

  useEffect(()=>{
    if(flag){
      console.log("flag=" + flag );
      setBoardDetail();
    }

  },[flag, setBoardDetail]);

  //게시글 삭제
  const deleteBoard = _id => {
    const send_param = {
      headers,
      _id,
      login_email : $.cookie("login_email")
    };

    //if($.cookie("login_id"))
    if (window.confirm("정말 삭제하시겠습니까?")) {
      axios
        .post("http://localhost:8080/board/delete", send_param)
        //정상 수행
        .then(returnData => {
          alert(returnData.data.message);
          window.location.href = "/";
        })
        //에러
        .catch(err => {
          console.log(err);
          alert("글 삭제 실패");
        });
    }
  };

  //댓글 삭제
  const removeComment = useCallback( _id => {
    const send_param={
      headers,
      _id,
      login_email : $.cookie("login_email")
    }
    axios
      .post("http://localhost:8080/comment/delete",send_param)
      .then(returnData=>{
        alert(returnData.data.message);
        setComments(returnData.data.comment);
        setComments(comments.filter(comment => comment._id !== _id));
      })
      .catch(err => {
        console.log(err);
        alert("글 삭제 실패");
      });
  },[setComments, comments]);

  //댓글 등록
  const writeComment = useCallback(() => {
    let url;
    //const formData = new FormData();
    const send_param = {
      headers,
      _id: props.location.query._id,
      _comment: boardTitle.current.value,
      login_email:$.cookie("login_email")      
    };
    axios
      .post("http://localhost:8080/board/writecomment", send_param)

      getCommentList();
  },[props.location.query, getCommentList]);

  const titleStyle = {
    marginBottom: 5,
  };
  const divStyle = {
    margin: 50
  };
  
  return (
  <>
    <div style={divStyle}>
            {board}
    </div>
    <Form.Control
      type="text"
      style={titleStyle}
      placeholder="댓글쓰기"
      ref={boardTitle}
      />
    <Button
      block
      onClick={writeComment}
    >
      댓글작성 
    </Button>
    {comments?<CommentList comments={comments} removeComment={removeComment}/>:""}
  </>);
  
}

export default BoardDetail;
