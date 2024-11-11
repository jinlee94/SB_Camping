import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from 'react-bootstrap/NavDropdown';
import '../css/common.css';
import {Link, useNavigate} from 'react-router-dom';
import {logout} from "../../slice/loginSlice";
import {useDispatch, useSelector} from "react-redux";
import logo from "../../images/logo/logo2-7.png";
import React from "react";



//{children}속성을 활용하여 컴포넌트 내부에 다른 컴포넌트를 적용시킬 수 있음
const BasicLayout = ({ children }) => {

  const logoutMsg = () => {
    const now = new Date();
    const currentTime = now.toLocaleString();
    alert(currentTime + " 관리자 로그아웃");
  }

  const navigate = useNavigate();
  const loginState = useSelector(state => state.loginSlice);
  const dispatch = useDispatch();

  const handleClickLogout = () => {
    logoutMsg();
    dispatch(logout());
    navigate("/");
  }

  return (
      // 가장 외곽을 묶는 기본 빈태그
      <>
        {/*부트스트랩 메뉴 컴포넌트*/}
        <Navbar bg="white" data-bs-theme="light">
          <Container>
            <img
                src={logo}
                alt="로고"
                style={{width: '350px', height: 'auto'}}
                onClick={() => navigate("/admin")}
                className="cursor-pointer"// 원하는 크기로 조정
            />
            <div id="">
              <Nav className="justify-content-end">
                <Nav.Link onClick={handleClickLogout}>로그아웃</Nav.Link>
                 <Nav.Link href="/" >사용자페이지로</Nav.Link>
              </Nav>
              <Nav className="justify-content-end">
                <NavDropdown href="/admin/site" title="구역 관리">
                  <NavDropdown.Item as={Link} to="/admin/site">구역 관리</NavDropdown.Item>
                </NavDropdown>
                <NavDropdown title="캠핑장 예약 관리">
                  <NavDropdown.Item as={Link} to="/admin/res/total">전체 예약 리스트</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/admin/res/datesite">날짜/구역별 예약 현황</NavDropdown.Item>
                </NavDropdown>
                <NavDropdown title="회원 관리">
                  <NavDropdown.Item href="/admin/member">전체 회원 리스트</NavDropdown.Item>
                  <NavDropdown.Item href="/admin/member/inactivelist">탈퇴/휴면 회원 리스트</NavDropdown.Item>
                </NavDropdown>
                <NavDropdown title="커뮤니티 관리">
                  <NavDropdown.Item as={Link} to="/admin/notices/list">공지사항</NavDropdown.Item>
                  <NavDropdown.Item href="/admin/qnas">문의 게시판</NavDropdown.Item>
                  <NavDropdown.Item href="/admin/campers">캠퍼 게시판</NavDropdown.Item>
                  <NavDropdown.Item href="/admin/reviews">리뷰 게시판</NavDropdown.Item>
                  <NavDropdown.Item href="/admin/lost">분실물 찾기</NavDropdown.Item>
                </NavDropdown>
                <NavDropdown title="통계 관리">
                  <NavDropdown.Item href="/admin/stats">예약 매출 통계</NavDropdown.Item>
                  <NavDropdown.Item href="/admin/stats/customer">고객 통계</NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </div>

          </Container>
        </Navbar>

        <main id="mainwrap">
          <Container>
            {children}
          </Container>
        </main>
      </>
  );
};

export default BasicLayout;
