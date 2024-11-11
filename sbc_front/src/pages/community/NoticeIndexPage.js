import { Outlet } from "react-router-dom";
import BasicLayout from "../../layouts/BasicLayout";
import CommunityMenu from "../../layouts/CommunityMenu";


const NoticeIndexPage = () =>{
    return(
        <BasicLayout>
            <CommunityMenu/>
            <div>
                <div>
                    <div className="mt-3"><h1>공지 게시판</h1></div>
                    <hr/>
                </div>
                <div>
                    <Outlet/>
                </div>

            </div>
        </BasicLayout>
    );
}

export default NoticeIndexPage;