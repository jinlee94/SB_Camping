import axios from "axios";

const API_SERVER_HOST = 'http://localhost:8080';
const host = `${API_SERVER_HOST}/api`

const rest_api_key = `9ee86052c294ac349a0fe4f3546cc55a`
const redirect_uri = `http://localhost:3000/login/kakao`
const auth_code_path = `https://kauth.kakao.com/oauth/authorize`
const access_token_url = `https://kauth.kakao.com/oauth/token`


// 카카오 인가코드 요청
export const getKakaoLoginLink = () => {
    const kakaoURL = `${auth_code_path}?client_id=${rest_api_key}&redirect_uri=${redirect_uri}&response_type=code&prompt=select_account`;
    // prompt=select_account 간편로그인. 사용하지 않으려면 prompt 파라미터 자체를 지우면 됨
    return kakaoURL
}

// 인가코드로 토큰 요청
export const getAccessToken = async (authCode) => {
    const header ={
        headers:{
            "Content-Type" : "application/x-www-form-urlencoded",
        }
    }
    const params = {
        grant_type : "authorization_code",
        client_id : rest_api_key,
        redirect_uri : redirect_uri,
        code : authCode,
    }
    const result = await axios.post(access_token_url, params, header)
    const accessToken = result.data.access_token

    return accessToken
}

// 토큰으로 사용자 정보 요청
export const getMemberInfoWithAccessToken = async (accessToken) => {
    const result = await axios.get(`${host}/auth/kakao?accessToken=${accessToken}`)
    return result.data;
}