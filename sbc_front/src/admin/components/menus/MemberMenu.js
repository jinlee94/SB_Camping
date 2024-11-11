import '../../../admin/css/menu.css'
import { Link } from "react-router-dom"


const MemberMenu = () => {
    return(
        <>        
        <div id='menubuttonwrap'>
          <Link to={'/admin/member'} className='menubutton'>전체 회원 리스트</Link>
          <Link to={'/admin/member/inactivelist'} className='menubutton'>탈퇴/휴면 회원 리스트</Link>
        </div>
        </>

    );
    
}

export default MemberMenu;