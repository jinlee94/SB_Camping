import { Outlet } from "react-router-dom";
import BasicLayout from "../../layouts/BasicLayout";
import StatsMenu from "../../components/menus/StatsMenu";
import useCustomLogin from "../../../hooks/useCustomLogin";

const StatsIndexPage = () =>{

    // 로그인 여부 확인
    const {isLogin, moveToLoginReturn} = useCustomLogin()
    if (!isLogin) {
        alert('이 페이지에 접근하려면 로그인이 필요합니다');
        return moveToLoginReturn()
    }

    return(
        <BasicLayout>
            <div>
            <StatsMenu/>
            </div>
            <div>
                <Outlet/>
            </div>
        </BasicLayout>
    );
}

export default StatsIndexPage;