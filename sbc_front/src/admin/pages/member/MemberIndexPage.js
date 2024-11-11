import { Outlet } from "react-router-dom";
import BasicLayout from "../../layouts/BasicLayout";
import MemberMenu from "../../components/menus/MemberMenu";
import useCustomLogin from "../../../hooks/useCustomLogin";

const MemberIndexPage = () =>{

    // 로그인 여부 확인
    const {isLogin, moveToLoginReturn} = useCustomLogin()
    if (!isLogin) {
        alert('이 페이지에 접근하려면 로그인이 필요합니다');
        return moveToLoginReturn()
    }

    return(
        <BasicLayout>
            <div>
            <MemberMenu/>
            </div>
            <div>
                <Outlet/>
            </div>
        </BasicLayout>
    );
}

export default MemberIndexPage;