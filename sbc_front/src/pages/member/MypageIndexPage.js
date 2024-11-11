import BasicLayout from "../../layouts/BasicLayout";
import MypageMenu from "../../layouts/MypageMenu";
import {Outlet} from "react-router-dom";
import useCustomLogin from "../../hooks/useCustomLogin";
import {useSelector} from "react-redux";

const MypageIndexPage = () => {

    // 로그인 여부 확인
    const {isLogin, moveToLoginReturn} = useCustomLogin()
    if(!isLogin){
        alert('회원만 이용가능합니다.')
        return moveToLoginReturn()
    }

    return(
        <BasicLayout>
            <MypageMenu/>
            <Outlet/>
        </BasicLayout>
    );
}

export default MypageIndexPage;