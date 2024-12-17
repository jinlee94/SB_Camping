import { Link } from "react-router-dom";
import { getKakaoLoginLink } from "../../api/kakaoApi"
import kakaoImage from "../../images/kakao/kakao_login_large_wide.png";
import '../../css/login.css'

const KakaoLoginComponent = () => {
    const link = getKakaoLoginLink();
    return(
        <a href={link}>
            <img src={kakaoImage} className="kakao_button" alt="카카오로그인" />
        </a>

    )
}

export default KakaoLoginComponent;