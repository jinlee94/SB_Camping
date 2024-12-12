import axios from "axios";

const API_SERVER_HOST = 'http://localhost:8080';
const host = `${API_SERVER_HOST}/api`

const rest_api_key = `9ee86052c294ac349a0fe4f3546cc55a`
const redirect_uri = `http://localhost:3000/login/kakao`
const auth_code_path = `https://kauth.kakao.com/oauth/authorize`
const access_token_url = `https://kauth.kakao.com/oauth/token`

// 로그인(POST) 요청
export const loginPost = async (loginParam) => {
    const header = {
        headers : {'Content-Type': 'x-www-form-urlencoded'}
    }
    const form = new FormData()
    form.append('username', loginParam.email)
    form.append('password', loginParam.pw)

    const result = await axios.post(`${host}/auth/login`, form, header)
    //console.log(result);

    return result.data;
}

// 회원가입(POST) 요청
export const joinPost = async (member) => {
    const header = {
        headers:{'Content-Type': 'application/json'}
    }
    const result = await axios.post(`${host}/auth/`, JSON.stringify(member), header);
    console.log(result);
    return result.data;
}

// 이메일 중복체크 요청
export const emailCheck = async (email) => {
    const res = await axios.get(`${host}/auth/email`,
        {params: {email}});
    console.log(res);
    return res.data;
}

// 핸드폰번호 중복 체크 요청
export const phoneCheck = async (phone) => {
    const res = await axios.get(`${host}/auth/phone`, {params: {phone}});
    console.log("api 핸드폰 중복체크" + res);
    return res.data;
}

// 이름 + 핸드폰 번호로 이메일 찾기
export const findEmail = async (member) => {
    const header = {
        headers:{'Content-Type': 'application/json'}
    }
    const res = await axios.post(`${host}/auth/email/retrieve`, JSON.stringify(member), header);
    console.log(res);
    return res.data;
}

// 비밀번호 찾기 1 - 이름 + 이메일로 회원 조회
export const findpwMember = async (member) => {
    const header = {
        headers:{'Content-Type': 'application/json'}
    }
    const res = await axios.post(`${host}/auth/password/retrieve`, JSON.stringify(member), header);
    console.log(res); // 일치하는 회원이 존재하면 "result" : "exist" 못 찾으면 "not_exist" 반환
    return res.data;
}

// 비밀번호 찾기 1.5 - 메일 보내기
export const sendEmail = async (email) => {
    const res = await axios.get(`${host}/auth/password/sendemail`, {params: {email}});
    console.log(res);
    return res.data;
}

// 비밀번호 찾기 2 - 비밀번호 변경
export const modifyPw = async (member) => {
    console.log('값 확인 : ', member)
    // const header = {
    //     headers:{'Content-Type': 'application/json'}
    // }
    const res = await axios.post(`${host}/auth/password/update`, member);
    console.log(res); // "msg" : "success" 또는 "fail
    return res.data;
}

export default API_SERVER_HOST;
