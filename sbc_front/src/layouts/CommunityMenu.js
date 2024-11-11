import '../css/menu.css';
import {Link, useLocation} from "react-router-dom"

const CommunityMenu = () => {

    const location = useLocation();
    // 클릭한 메뉴 버튼 색깔 변경 (해당 URL이면 className에 active 추가)
    const isActive = (path) => location.pathname.startsWith(path)

    return(
        <>        
        <div className='imgwrap'>
            <img src="https://cdn.pixabay.com/photo/2020/03/26/10/58/norway-4970080_1280.jpg" id="menuImg"></img>
        </div>
        <div id='menubuttonwrap' className="mb-10">
          <Link to={'/notices'} className={`menubutton ${isActive('/notices') ? 'active' : ''}`}>공지사항</Link>
          <Link to={'/qna'} className={`menubutton ${isActive('/qna') ? 'active' : ''}`}>문의게시판</Link>
          <Link to={'/campers'} className={`menubutton ${isActive('/campers') ? 'active' : ''}`}>캠퍼게시판</Link>
          <Link to={'/review'} className={`menubutton ${isActive('/review') ? 'active' : ''}`}>리뷰게시판</Link>
          <Link to={'/lost'} className={`menubutton ${isActive('/lost') ? 'active' : ''}`}>분실물 찾기</Link>
        </div>
        </>

    );
    
}

export default CommunityMenu;