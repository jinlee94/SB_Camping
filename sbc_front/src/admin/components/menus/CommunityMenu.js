import '../../../admin/css/menu.css'
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from 'react';

const CommunityMenu = () => {
    const location = useLocation();
    const [activeMenu, setActiveMenu] = useState('');

    // 현재 경로에 따라 활성화된 메뉴 설정
    useEffect(() => {
        setActiveMenu(location.pathname);
    }, [location]);

    return(
        <div id='menubuttonwrap'>
            <Link
                to='/admin/notices'
                className={`menubutton ${activeMenu === '/admin/notices' ? 'active' : ''}`}
            >
                공지사항
            </Link>
            <Link
                to='/admin/qnas'
                className={`menubutton ${activeMenu === '/admin/qnas' ? 'active' : ''}`}
            >
                문의게시판
            </Link>
            <Link
                to='/admin/campers'
                className={`menubutton ${activeMenu === '/admin/campers' ? 'active' : ''}`}
            >
                캠퍼게시판
            </Link>
            <Link
                to='/admin/reviews'
                className={`menubutton ${activeMenu === '/admin/reviews' ? 'active' : ''}`}
            >
                리뷰게시판
            </Link>
            <Link
                to='/admin/lost'
                className={`menubutton ${activeMenu === '/admin/lost' ? 'active' : ''}`}
            >
                분실물 찾기
            </Link>
        </div>
    );
}

export default CommunityMenu;