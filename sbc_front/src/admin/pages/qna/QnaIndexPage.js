import {Outlet} from "react-router-dom";
import BasicLayout from "../../layouts/BasicLayout";
import CommunityMenu from "../../components/menus/CommunityMenu";
import useCustomLogin from "../../../hooks/useCustomLogin";
const QnaIndexPage = () =>{

      return(
        <BasicLayout>
            <div>
            <CommunityMenu/>
            </div>
            <div><h1>문의 게시판</h1></div>
            <hr/>
            <div>
                <Outlet/>
            </div>
        </BasicLayout>
    );
}

export default QnaIndexPage;