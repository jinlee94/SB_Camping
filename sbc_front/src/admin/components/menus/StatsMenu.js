import '../../../admin/css/menu.css'
import { Link } from "react-router-dom"

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

const StatsMenu = () => {
    return(
        <>        
        <div id='menubuttonwrap'>
          <Link to={'/admin/stats/reservation-sales'} className='menubutton'>예약 매출 통계</Link>
          <Link to={'/admin/stats/customer'} className='menubutton'>고객 통계</Link>
        </div>
        </>

    );
    
}

export default StatsMenu;