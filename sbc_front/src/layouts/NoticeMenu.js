import '../css/menu.css';
import { Link } from "react-router-dom"

const NoticeMenu = () => {
    return(
        <>        
        <div className='imgwrap'>
            <img src="https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" id="menuImg"></img>
        </div>
        <div id='menubuttonwrap'>
          <Link to={'/notice'} className='menubutton'>공지사항</Link>
          <Link to={'/qna'} className='menubutton'>문의게시판</Link>
          <Link to={'#'} className='menubutton'>캠퍼게시판</Link>
          <Link to={'#'} className='menubutton'>리뷰게시판</Link>
        </div>
        </>

    );
    
}

export default NoticeMenu;