import '../../../admin/css/menu.css'
import { Link } from "react-router-dom";
import React, { useEffect } from "react";

const ResMenu = () => {
    useEffect(() => {
        // 클릭 이벤트 핸들러
        const handleClick = (event) => {
            const div2 = document.getElementsByClassName("menubutton");

            if (event.target.classList.contains("clicked")) {
                event.target.classList.remove("clicked");
            } else {
                for (let i = 0; i < div2.length; i++) {
                    div2[i].classList.remove("clicked");
                }
                event.target.classList.add("clicked");
            }
        };

        // 초기화 및 이벤트 리스너 추가
        const div2 = document.getElementsByClassName("menubutton");
        for (let i = 0; i < div2.length; i++) {
            div2[i].addEventListener("click", handleClick);
        }

        // 클린업 함수: 컴포넌트 언마운트 시 이벤트 리스너 제거
        return () => {
            for (let i = 0; i < div2.length; i++) {
                div2[i].removeEventListener("click", handleClick);
            }
        };
    }, []);

    return (
        <div id='menubuttonwrap'>
            <Link to='total' className='menubutton'>전체 예약 리스트</Link>
            <Link to='datesite' className='menubutton'>날짜 / 구역별 예약</Link>
        </div>
    );
}

export default ResMenu;
