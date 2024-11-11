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

const SiteMenu = () => {
    return(
        <>        
        <div id='menubuttonwrap'>
          <Link to={'admin/site'} className='menubutton'>구역 관리</Link>
        </div>
        </>

    );
    
}

export default SiteMenu;