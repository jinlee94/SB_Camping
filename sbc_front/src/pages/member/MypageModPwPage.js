import {useState} from "react";
import useCustomLogin from "../../hooks/useCustomLogin";
import {modifyPw} from "../../api/memberApi";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import '../../css/login.css'
import {useSelector} from "react-redux";


const MypageModPwPage = () => {

    const [validated, setValidated] = useState(false);
    // 비밀번호 검사용 변수
    const [pwd, setPwd] = useState("");
    const [isPwdValid, setIsPwdValid] = useState(true);
    const [isPwdMatch, setIsPwdMatch] = useState(true);

    const {moveToPath} = useCustomLogin()

    // 파라미터 가져오기 (memberId)
    const loginState = useSelector((state) => state.loginSlice)
    const [member, setMember] = useState({
        memberID: loginState.member.memberId,
        memberPw: '',
    })
    const isSocial = loginState.member.isSocial;

    /* 비밀번호 입력 */
    const handleChange = (event) => {
        // 비밀번호 유효성 검사
        const tempPw = event.target.value;
        const regExp = /^(?=.*[a-z])((?=.*\d)|(?=.*\W)).{10,15}$/;
        if (regExp.test(tempPw)) {
            setPwd(tempPw)
            setIsPwdValid(true);
        } else {
            setIsPwdValid(false);
        }
    }

    /* 비밀번호 재확인 */
    const handleConfirmPwd = (event) => {
        const confirmPwd = event.target.value;
        const regExp = /^(?=.*[a-z])((?=.*\d)|(?=.*\W)).{10,15}$/;
        if (pwd === confirmPwd && regExp.test(confirmPwd)) {
            setIsPwdMatch(true);
        } else {
            setIsPwdMatch(false);
        }
    }

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        setValidated(true)

        let valid = true; // 유효성 검사 결과를 추적할 변수

        if (isPwdValid === false || pwd === '' || isPwdMatch === false) {
            alert('비밀번호를 확인해주세요')
            valid = false;
            event.preventDefault();
            return;
        }

        // 부트스트랩 동작
        if (form.checkValidity() === false || !valid) {
            event.stopPropagation();
        } else {
            // 유효성 검사를 통과했으면 API 요청
            member.memberPw = pwd;
            handleModPw(member)
        }
        setValidated(true);
    };

    // 유효성 검사를 모두 통과하면 동작
    const handleModPw = async (member) => {
        try {
            const action = await modifyPw(member)
            if (action.error) {
                alert('비밀번호 변경 실패')
            } else if (action.msg === 'success') {
                // 성공하면 로그인 페이지로 이동
                alert('비밀번호가 변경되었습니다')
                moveToPath('/mypage')
            } else if (action.msg === 'fail') {
                alert('탈퇴한 회원이거나 오류로 인해 비밀번호 변경에 실패하였습니다.')
            }
        } catch (error) {
            console.log('서버 요청 실패 : ', error);
        }
    }


    return (
        <>
            <div style={{marginTop: '30px'}}>
                <h3>비밀번호 변경</h3>
                <hr></hr>
            </div>
            {isSocial=='N' ? 
            <div id="loginwrap">

                <div className="modPwWrap">
                    {/* 비밀번호 */}
                    <Form noValidate validated={validated} onSubmit={handleSubmit} id="loginbox">
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm={4} style={{marginRight: '-25px', marginLeft: '-15px'}}>
                                새 비밀번호
                            </Form.Label>
                            <Col sm={9}>
                                <Form.Control type="password"
                                              name="memberPw"
                                              placeholder="영문소문자,숫자,특수문자 포함 10-15자"
                                              style={{fontSize: '13px', padding: '10px', border: '1px solid grey'}}
                                              required
                                              minLength={10}
                                              maxLength={15}
                                              onChange={handleChange}
                                              isInvalid={!isPwdValid}
                                />
                                <Form.Control.Feedback type="invalid">
                                    비밀번호를 확인해주세요.
                                </Form.Control.Feedback>
                            </Col>
                        </Form.Group>

                        {/* 비밀번호 재확인 */}
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm={3} style={{marginRight: '-10px'}}>
                                비밀번호 확인
                            </Form.Label>
                            <Col sm={9} id={"pwrebox"}>
                                <Form.Control type="password"
                                              placeholder="영문소문자,숫자,특수문자 포함 10-15자"
                                              style={{fontSize: '13px', padding: '10px', border: '1px solid grey'}}
                                              required
                                              minLength={10}
                                              maxLength={15}
                                              onChange={handleConfirmPwd}
                                              isInvalid={!isPwdMatch}
                                />
                                <Form.Control.Feedback type="invalid">
                                    비밀번호가 일치하지 않습니다.
                                </Form.Control.Feedback>
                            </Col>
                        </Form.Group>

                        <Button className="loginbutton_default" type="submit"
                                onClick={handleSubmit}>비밀번호 변경</Button>
                    </Form>
                </div>
            </div>
            : <div className="flex flex-col items-center justify-center text-center mt-5">소셜회원은 비밀번호 변경 기능이 없습니다.</div>}
        </>
    )
}

export default MypageModPwPage;
