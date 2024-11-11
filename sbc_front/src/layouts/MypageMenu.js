import '../css/menu.css';
import { Link } from "react-router-dom"

const MypageMenu = () => {

    const isActive = (path) => window.location.pathname.startsWith(path)

    return(
        <>
            <div className='imgwrap'>
                <img src="https://cdn.pixabay.com/photo/2020/05/26/12/55/milkyway-5222932_1280.jpg" id="menuImg" alt="메뉴_캠핑장이미지"></img>
            </div>
            <div id='menubuttonwrap'>
                <Link to={'/mypage/res'} className={`menubutton ${isActive('/mypage/res') ? 'active' : ''}`}>나의예약내역</Link>
                <Link to={'/mypage/info'} className={`menubutton ${isActive('/mypage/info') ? 'active' : ''}`}>회원정보수정</Link>
                <Link to={'/mypage/modpw'} className={`menubutton ${isActive('/mypage/modpw') ? 'active' : ''}`}>비밀번호변경</Link>
            </div>
        </>

    );

}

export default MypageMenu;