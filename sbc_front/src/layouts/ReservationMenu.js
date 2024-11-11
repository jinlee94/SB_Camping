import '../css/menu.css';
import { Link, useLocation } from "react-router-dom"

var div2 = document.getElementsByClassName("menubutton");

function handleClick(event) { 
if (event.target.classList[1] === "clicked") {
    event.target.classList.remove("clicked");
} 
else {
    for (var i = 0; i < div2.length; i++) {
    div2[i].classList.remove("clicked");
    }
    event.target.classList.add("clicked");
}
}

function init() {
for (var i = 0; i < div2.length; i++) {
    div2[i].addEventListener("click", handleClick);
}
}

init();


const ReservationMenu = () => {

    const location = useLocation();
    // 클릭한 메뉴 버튼 색깔 변경 (해당 URL이면 className에 active 추가)
    const isActive = (path) => location.pathname.startsWith(path)


    return(
        <>        
        <div className='imgwrap'>
            <img src="https://cdn.pixabay.com/photo/2018/05/13/20/21/lake-3397784_1280.jpg" id="menuImg"></img>
        </div>
        <div id='menubuttonwrap'>
          <Link to={'/res/info'} className={`menubutton ${isActive('/res/info') ? 'active' : ''}`}>예약/요금안내</Link>
          <Link to={'/res/realtime'} className={`menubutton ${isActive('/res/realtime') ? 'active' : ''}`}>실시간예약</Link>
        </div>
        </>

    );
    
}

export default ReservationMenu;