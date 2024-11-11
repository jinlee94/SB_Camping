import {createSearchParams, Navigate, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {loginPostAsync} from "../slice/loginSlice";

const useCustomLogin = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // 로그인 상태
    const loginState = useSelector(state => state.loginSlice);

    // 로그인 여부 (email 정보 확인)
    const isLogin = loginState.member.memberEmail ? true : false;

    // 로그인 함수
    const doLogin = async (loginParam) => {
        const action = await dispatch(loginPostAsync(loginParam))
        return action.payload;
    }

    // 페이지 이동
    const moveToPath = (path) => {
        navigate({pathname : path}, {replace : true});
    }

    // 로그인 페이지로 이동 (클릭 등 이벤트)
    const moveToLogin = () => {
        navigate({pathname : '/login'}, {replace : true})
    }

    // 로그인 페이지로 이동 컴포넌트 (렌더링시 이동)
    const moveToLoginReturn = () => {
        return <Navigate replace to={"/login"}/>
    }

    // 토큰에 따른 예외 처리 (AccessToken이 아예 없거나 권한이 없는 경우)
    // ★★★★★ 권한이 필요한 게시판 URL에 해당 예외 처리 추가해줘야함. (마이페이지 등)
    const exceptionHandle = (ex) => {
        console.log("토큰 Exception"+ ex);
        const errorMsg = ex.response.data.error;
        const errorStr = createSearchParams({error:errorMsg}).toString();
        console.log('게시판 권한 예외 : ', errorStr)
        if(errorStr === 'REQUIRE_LOGIN'){
            alert('회원만 이용가능합니다.');
            //navigate({pathname:'/login', search: errorStr})
            return
        }
        if(ex.response.data.error === 'ERROR_ACCESSDENIED'){
            alert('해당 메뉴를 사용할 수 있는 권한이 없습니다.');
            console.log('ERROR_ACCESSDENIED', ex)
            //navigate({pathname:'/login', search: errorStr})
            return
        }
    }

    return {loginState, doLogin, moveToLogin, isLogin, moveToPath, moveToLoginReturn, exceptionHandle}
}

export default useCustomLogin;