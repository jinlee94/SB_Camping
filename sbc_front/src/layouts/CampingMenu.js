import '../css/menu.css';
import {Link, useLocation} from "react-router-dom"
import camp from '../images/camping-area.jpg'

const CampingMenu = () => {
    const location = useLocation();
    // 클릭한 메뉴 버튼 색깔 변경 (해당 URL이면 className에 active 추가)
    const isActive = (path) => location.pathname.startsWith(path)

    return(
        <>        
        <div className='imgwrap'>
            <img src="https://cdn.pixabay.com/photo/2017/08/01/13/19/fire-2565355_1280.jpg" id="menuImg"></img>
        </div>
        <div id='menubuttonwrap'>
          <Link to={'/camping/intro'} className={`menubutton ${isActive('/camping/intro') ? 'active' : ''}`}>캠핑장 소개</Link>
          <Link to={'/camping/guide'} className={`menubutton ${isActive('/camping/guide') ? 'active' : ''}`}>시설안내도</Link>
          <Link to={'/camping/how'} className={`menubutton ${isActive('/camping/how') ? 'active' : ''}`}>찾아오시는 길</Link>
        </div>
        </>

    );
    
}

export default CampingMenu;