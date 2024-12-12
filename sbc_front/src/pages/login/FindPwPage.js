import BasicLayout from "../../layouts/BasicLayout";
import LoginMenu from "../../layouts/LoginMenu";
import {useState} from "react";
import '../../css/login.css'
import {findpwMember, modifyPw, sendEmail} from "../../api/memberApi";
import useCustomLogin from "../../hooks/useCustomLogin";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

{/* 이름, 이메일 입력 컴포넌트*/}
const AuthNameAndEmail = ({onSuccess}) => {
    const [member, setMembers] = useState({memberName : '', memberEmail : '', memberID : '',})
    const [showModal, setShowModal] = useState(false);
    const [authCode, setAuthCode] = useState('');
    const [sendingCode, setSendingCode] = useState('');

    const handleChange = (e) => {
        setMembers({ ...member, [e.target.name]: e.target.value });
    }

    // '비밀번호 변경' 버튼 동작 (유효성 검사)
    const handleSubmit = (e) => {
        if(!member.memberName){
            alert('이름을 입력해주세요')
            e.preventDefault()
            return
        } else if(member.memberName)
            if(!member.memberEmail){
                alert('이메일을 입력해주세요')
                e.preventDefault()
            } else{
                handleFindMemberByNameAndEmail(member)
            }
    }

    // 회원 조회 API 요청
    const handleFindMemberByNameAndEmail = async (member) => {
        try {
            const action = await findpwMember(member)
            member.memberID = action.memberID;
            console.log('findpwMember 완료 :', action);
            if(!action){
                alert('회원을 찾을 수 없습니다. 이름 또는 이메일을 다시 확인해주세요.')
            } else if(action){
                setShowModal(true); // 모달 열기
            }
        } catch (err){
            console.log('요청 오류')
            alert('회원을 찾을 수 없습니다. 이름 또는 이메일을 다시 확인해주세요.')
        }
    }

    // 인증 메일 발송
    const handleSendEmail = async () => {
        try{
            const result = await sendEmail(member.memberEmail);
            if(result.msg === '전송'){
                setSendingCode(result.code)
            }
        }catch(err){
            console.log('요청 오류');
        }
    }

    // 인증번호 입력 처리 함수
    const handleAuthCodeChange = (e) => setAuthCode(e.target.value);

    // 인증번호 일치 여부
    const handleSubmitEmail = () => {
        console.log("인증번호 일치여부 까지 옴", authCode, " ",sendingCode);
        if(authCode === sendingCode){
            alert('인증번호 확인! 비밀번호를 변경해주세요.')
            onSuccess(member.memberID);
        } else{
            alert('인증번호가 일치하지 않습니다.');
            setAuthCode('');
        }
    }


    return(
        <BasicLayout>
            <LoginMenu/>
            <div style={{marginTop: '20px'}}>
                <h3>비밀번호 찾기</h3>
                <hr></hr>
            </div>
            <div id="loginwrap">
                <div id="loginbox">
                    <input type="text"
                           name="memberName"
                           value={member.memberName}
                           maxLength={'10'}
                           onChange={handleChange}
                           placeholder={" 이름을 입력해주세요"}></input><br></br>
                    <input type="email"
                           name="memberEmail"
                           value={member.memberEmail}
                           maxLength={'50'}
                           required
                           style={{fontSize: "16px"}}
                           onChange={handleChange}
                           placeholder={" 이메일을 입력해주세요."}></input>
                    <div>
                        <input type="submit" onClick={handleSubmit} className={"loginbutton_default"}
                               value={"이메일 인증"}></input>
                    </div>
                </div>
            </div>

            {/* 인증번호 입력 모달 */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>인증번호 입력</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="d-flex align-items-center">
                            <Button className="w-60 me-2" onClick={handleSendEmail}>메일 발송하기</Button>
                            <Form.Control
                                type="text"
                                value={authCode}
                                onChange={handleAuthCodeChange}
                                placeholder="인증번호 입력 후 확인 버튼을 눌러주세요"
                            />
                            
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        닫기
                    </Button>
                    <Button variant="primary" onClick={() => handleSubmitEmail()}>
                        확인
                    </Button>
                </Modal.Footer>
            </Modal>
        </BasicLayout>
    );
}


{/*
*
*
*
*
비밀번호 변경 컴포넌트
*
*
*
*
*/
}
const PwModifyPage = ({memberData}) => {
    const [validated, setValidated] = useState(false);
    // 비밀번호 검사용 변수
    const [pwd, setPwd] = useState("");
    const [isPwdValid, setIsPwdValid] = useState(true);
    const [isPwdMatch, setIsPwdMatch] = useState(true);

    const {moveToPath} = useCustomLogin()

    // 파라미터 가져오기 (memberId)
    const memberId = JSON.parse(memberData);
    console.log('memberId:', memberId);

    const [members, setMembers] = useState(
        {
            memberID : memberId,
            memberPw : '',
        })

    const handleChange = (event) => {
        // members 업데이트
        const {name, value} = event.target;
        setMembers((prevParams) => ({
            ...prevParams,
            [name]: value,
        }));

        // 비밀번호 유효성 검사
        if (name === 'memberPw') {
            const pw = event.target.value;
            const regExp = /^(?=.*[a-z])((?=.*\d)|(?=.*\W)).{10,15}$/;
            if (regExp.test(pw)) {
                setPwd(pw)
                setIsPwdValid(true);
            } else {
                setIsPwdValid(false);
            }
        }
    }

    /* 비밀번호 재확인 */
    const handleConfirmPwd = (event) => {
        const confirmPwd = event.target.value;
        if(pwd !== confirmPwd){
            setIsPwdMatch(false);
        } else {
            setIsPwdMatch(true);
        }
    }


    const handleSubmit = (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        setValidated(true)

        let valid = true; // 유효성 검사 결과를 추적할 변수

        if(!isPwdValid || !isPwdMatch){
            valid = false;
            event.preventDefault();
        }

        // 부트스트랩 동작
        if (form.checkValidity() === false || !valid) {
            event.stopPropagation();
        } else{
            // 유효성 검사를 통과했으면 API 요청
            members.memberPw = pwd
            handleModPw(members)
        }
        setValidated(true);

    };

    // 유효성 검사를 모두 통과하면 동작
    const handleModPw = async (member) => {
        try {
            const action = await modifyPw(member)
            //console.log('비밀번호 변경 동작', action)
            if(action.error) {
                //console.log('비밀번호 변경 실패')
                alert('비밀번호 변경 실패')
            } else if(action.msg === 'success') {
                // 성공하면 가입 완료 페이지로 이동
                alert('비밀번호가 변경되었습니다')
                moveToPath('/login')
            } else if (action.msg === 'fail'){
                alert('탈퇴한 회원이거나 오류로 인해 비밀번호 변경에 실패하였습니다.')
                console.log(isPwdValid, isPwdMatch)
            }
        } catch (error){
            console.log('서버 요청 실패 : ', error);
        }
    }

    return(
        <BasicLayout>
            <LoginMenu/>
            <div id="loginwrap">
                <div>
                    <h3>비밀번호 변경</h3>
                </div>
                <div className="modPwWrap">
                    {/* 비밀번호 */}
                    <Form noValidate validated={validated} onSubmit={handleSubmit} id="loginbox">
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm={3} style={{marginRight:'-10px'}}>
                                비밀번호
                            </Form.Label>
                            <Col sm={9}>
                                <Form.Control type="password"
                                              name="memberPw"
                                              placeholder="영문소문자,숫자,특수문자 포함 10-15자"
                                              style={{fontSize:'13px', padding:'10px',border:'1px solid grey'}}
                                              required
                                              id={"password"}
                                              minLength={10}
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
                            <Form.Label column sm={3} style={{marginRight:'-10px'}}>
                                비밀번호 확인
                            </Form.Label>
                            <Col sm={9} id={"pwrebox"}>
                                <Form.Control type="password"
                                              placeholder="영문소문자,숫자,특수문자 포함 10-15자"
                                              style={{fontSize:'13px', padding:'10px', border:'1px solid grey'}}
                                              required
                                              id={"password_re"}
                                              minLength={10}
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
        </BasicLayout>
    )
}







const FindPwPage = () => {
    const [showPwModify, setShowPwModify] = useState(false);
    const [memberData, setMemberData] = useState(null);

    const handleAuthSuccess = (data) => {
        setMemberData(data);
        setShowPwModify(true); // 비밀번호 인증 성공 시 회원정보 컴포넌트 표시
    };

    return (
        <div>
            {!showPwModify ? (
                <AuthNameAndEmail onSuccess={handleAuthSuccess} />
            ) : (
                <PwModifyPage memberData={memberData} />
            )}
        </div>
    );
}

export default FindPwPage;