import { Outlet } from "react-router-dom";
import BasicLayout from "../../layouts/BasicLayout";
import CommunityMenu from "../../components/menus/CommunityMenu";

const ReviewIndexPage = () =>{
    return(
        <BasicLayout>
            <div>

                <CommunityMenu/>
            </div>
            <div>
                <div><h1>리뷰 게시판</h1></div>
                <hr/>
                <Outlet/>
            </div>
        </BasicLayout>
    );
}

export default ReviewIndexPage;