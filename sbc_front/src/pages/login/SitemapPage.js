import BasicLayout from "../../layouts/BasicLayout";
import "../../css/sitemap.css"

const SitemapPage = () => {
    return (
        <BasicLayout>
            <div id="title_container" className="wrap">
                <h4>사이트맵</h4>
                <hr></hr>
            </div>
            <div class="page sites mt-5" id="sub_page">
                <ul class="first_content">
                    <li className="first">
                        <h3><a href="/camping/intro">캠핑장안내</a></h3>
                        <ul>
                            <li><a href="/camping/intro">캠핑장소개</a></li>
                            <li><a href="/camping/guide">시설안내도</a></li>
                            <li><a href="/camping/how">찾아오시는 길</a></li>
                        </ul>
                    </li>
                    <li className="two">
                        <h3><a href="/res/info">캠핑장 예약</a></h3>
                        <ul>
                            <li><a href="/res/info">예약/요금안내</a></li>
                            <li><a href="/res/realtime">실시간 예약</a></li>
                        </ul>
                    </li>
                    <li className="three mb-5">
                        <h3><a href="/notice">커뮤니티</a></h3>
                        <ul>
                            <li><a href="/notices">공지사항</a></li>

                            <li><a href="/qna">문의 게시판</a></li>
                            <li><a href="/campers">캠퍼 게시판</a></li>
                            <li><a href="/review">리뷰 게시판</a></li>
                            <li><a href="/lost">분실물 찾기</a></li>
                        </ul>
                    </li>
                    <li className="four">
                        <h3><a href="/login">로그인</a></h3>
                        <ul>
                            <li><a href="/login">로그인</a></li>
                            <li><a href="/findemail">이메일 찾기</a></li>
                            <li><a href="/findpw">비밀번호 찾기</a></li>
                            <li><a href="/join">회원가입</a></li>
                        </ul>
                    </li>
                    <li className="five">
                        <h3><a href="/mypage">마이 페이지</a></h3>
                        <ul>
                            <li><a href="/mypage/res">나의 예약내역</a></li>
                            <li><a href="/mypage/info">회원정보 수정</a></li>
                            <li><a href="/mypage/modpw">비밀번호 변경</a></li>
                            <li><a href="/mypage/withdraw">회원 탈퇴</a></li>
                        </ul>
                    </li>
                    <li className="six">
                        <h3><a href="#">기타</a></h3>
                        <ul>
                            <li><a href="#">개인정보처리방침</a></li>
                            <li><a href="#">이용약관</a></li>
                            <li><a href="/sitemap">사이트맵</a></li>
                        </ul>
                    </li>
                </ul>
            </div>
        </BasicLayout>
    );
}

export default SitemapPage;