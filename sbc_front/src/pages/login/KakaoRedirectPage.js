import { useEffect } from "react";
import { useSearchParams } from "react-router-dom"
import { getAccessToken, getMemberInfoWithAccessToken } from "../../api/kakaoApi";
import { useDispatch } from "react-redux";
import { login } from "../../slice/loginSlice";
import useCustomLogin from "../../hooks/useCustomLogin";

const KakaoRedirectPage = () => {
    const [searchParams] = useSearchParams();
    const authCode = searchParams.get("code")
    const dispatch = useDispatch()
    const { moveToPath } = useCustomLogin()

    // 인가 코드가 변경되었을때 액세스 토큰 호출
    useEffect(() => {
        getAccessToken(authCode).then(accessToken => {
            console.log("토큰 : ", accessToken)
            getMemberInfoWithAccessToken(accessToken).then(memberInfo => {
                console.log("memberInfo", memberInfo)
                dispatch(login(memberInfo))
                moveToPath("/")
            })
        })
    }, [authCode])
    
    return(
        <div>
            <div>Kakao 로그인 처리 중. . .</div>
        </div>
    )
}

export default KakaoRedirectPage;