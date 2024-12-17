import {authPw} from "../../api/mypageApi";
import {useSelector} from "react-redux";
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import {useEffect, useState} from "react";
import useCustomLogin from "../../hooks/useCustomLogin";
import "../../css/join.css";
import "../../css/login.css";
import {getMember, modifyMember} from "../../api/mypageApi";
import {useNavigate} from "react-router-dom";
import { phoneCheck } from "../../api/memberApi";

{/* 비밀번호 인증 컴포넌트 */}
const PasswordAuth = ({onSuccess}) => {

    const [validated, setValidated] = useState(false);

    const loginState = useSelector((state) => state.loginSlice)
    const memberState = {
        memberID : loginState.member.memberId,
        memberPw : '',
        isSocial : loginState.member.isSocial,
    }
    // console.log('Id확인', loginState.member.memberId)
    const [member, setMember] = useState(memberState);
    const [pwd, setPwd] = useState("");
    const [isPwdValid, setIsPwdValid] = useState(true);
    const navigate = useNavigate();

    const handleChangePw = (event) => {
        // members 업데이트
        const {name, value} = event.target;
        setMember((prevParams) => ({
            ...prevParams,
            [name]: value,
        }));

        // 비밀번호 유효성 검사
        if (name === "memberPw") {
            setPwd(event.target.value);
            const regExp = /^(?=.*[a-z])((?=.*\d)|(?=.*\W)).{10,15}$/;
            if (regExp.test(event.target.value)) {
                setIsPwdValid(true);
            } else {
                setIsPwdValid(false);
            }
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        // console.log(member);
        try {
            authPw(member).then((data) => {
                // console.log(data);
                if(data.msg === 'success'){
                    onSuccess();
                } else if(data.msg === 'fail'){
                    alert('비밀번호가 일치하지 않습니다.')
                }
            })
        } catch (error) {
            console.log(error)
            console.log('서버오류')
        }
    }

    useEffect (() => {
        if(memberState.isSocial == "Y"){
            onSuccess();
        }
    })

    return(
        <>
            <div style={{marginTop: '30px'}}>
                <h3>회원 인증</h3>
                <hr></hr>
            </div>

    <div id="loginwrap">

        <div className="modPwWrap">
                <Form noValidate validated={validated} onSubmit={handleSubmit} id="loginbox">
                    <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
                        <Form.Label column sm="3" style={{marginRight:'-20px'}}>
                            이메일
                        </Form.Label>
                        <Col sm="9">
                            <Form.Control type="text"
                                          disabled
                                          value={loginState.member.memberEmail}
                                          style={{paddingLeft:'8px'}}
                            />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" >
                        <Form.Label column sm={3} style={{marginRight:'-20px'}}>
                            비밀번호
                        </Form.Label>
                        <Col sm={9}>
                            <Form.Control type="password"
                                          name="memberPw"
                                          placeholder="영소문자, 숫자, 특수문자 포함 10-15자"
                                          style={{fontSize:'13px', padding:'8px', border:'1px solid grey'}}
                                          required
                                          id={"password"}
                                          minLength={10}
                                          pattern={"^(?=.*[a-z])((?=.*\\d)|(?=.*\\W)).{10,15}$"}
                                          onChange={handleChangePw}
                                          isInvalid={!isPwdValid}
                            />
                            <Form.Control.Feedback type="invalid">
                                비밀번호를 확인해주세요.
                            </Form.Control.Feedback>
                        </Col>
                    </Form.Group>
                    <Button variant="success" className="loginbutton_default" type="submit" onClick={handleSubmit}>회원정보 수정</Button>
                </Form>
            </div>
        </div>
        </>
    )
}


{/* 회원정보 수정 컴포넌트*/}
const MemberInfo = () => {

    const navigate = useNavigate();
    const {moveToPath} = useCustomLogin()

    const loginState = useSelector((state) => state.loginSlice)
    const loginMemberId = loginState.member.memberId;
    const isSocial = loginState.member.isSocial;

    // 부트스트랩 변수
    const [validated, setValidated] = useState(false);

    const [members, setMembers] = useState(
        {
            memberEmail: '',
            memberPw: '',
            memberName: '',
            memberPhone: '',
            memberGender: '',
            memberBirth: '',
            memberLocal: '',
            memberRole: '',
            memberID: loginMemberId
        })

    useEffect(() => {
        getMember(loginMemberId).then((data) => {
            // console.log('member 조회 결과 : ', data);
            setMembers({
                memberEmail: data.member.memberEmail,
                memberName: data.member.memberName,
                memberPhone: data.member.memberPhone,
                memberGender: data.member.memberGender,
                memberBirth: data.member.memberBirth,
                memberLocal: data.member.memberLocal,
                memberRole: data.member.memberRole,
                memberID: data.member.memberId || loginMemberId,
            });
            setGender(data.member.memberGender);
            setLocal(data.member.memberLocal);
        })
    }, [loginMemberId]);

    // 이름 유효성 검사용 변수
    const [isNameValid, setIsNameValid] = useState(true);
    // 생년월일 유효성 검사용 변수
    const [isMemBirthValid, setIsMemBirthValid] = useState(true);
    // 핸드폰 번호 유효성 검사용 변수
    const [phone, setPhone] = useState(members.memberPhone);
    const [isPhoneValid, setIsPhoneValid] = useState(true);
    // 성별 유효성 검사용 변수
    const [gender, setGender] = useState(members.memberGender);
    const [isGenderValid, setIsGenderValid] = useState(true);
    // 지역 유효성 검사용 변수
    const [local, setLocal] = useState(members.memberLocal);
    const [isLocalValid, setIsLocalValid] = useState(true);


    /* 회원정보 수정 버튼 눌렀을 때 동작 */
    const handleSubmit = (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        setValidated(true)

        let valid = true; // 유효성 검사 결과를 추적할 변수

        // 이름
        if(isNameValid === false || members.memberName == ''){
            valid = false;
            event.preventDefault()
        }

        // 핸드폰 번호
        if(isPhoneValid == false || members.memberPhone == ''){
            valid = false;
            event.preventDefault()
        }

        // 성별 버튼 선택 여부
        if (!gender || gender == '' || members.memberGender =='') {
            setIsGenderValid(false);
            valid = false;
            event.preventDefault();
        } else {
            setIsGenderValid(true);
        }

        // 생년월일
        if(!isMemBirthValid || members.memberBirth == ''){
            valid = false;
            setIsMemBirthValid(false);
            event.preventDefault();
        }

        // 지역 선택 여부
        if (!local || local === '선택해주세요'){
            valid = false;
            setIsLocalValid(false);
            event.preventDefault();
        }

        console.log("local : ", local)

        // 부트스트랩 동작
        if (form.checkValidity() === false || valid === false ) {
            event.stopPropagation();
        } else{
            const confirm = window.confirm('수정하시겠습니까?')
            if(confirm){
                // 유효성 검사를 통과했으면 API 요청
                handleClickModify(members)
            }
        }
    };


    // 유효성 검사를 모두 통과하면 API 수정 요청
    const handleClickModify = async (members) => {
        try {
            // console.log('회원정보 수정 보내기 전 :' , members)
            const action = await modifyMember(members);
            // console.log('회원정보수정 결과 : ', action)
            if(action.error) {
                // console.log('회원정보 수정 실패 ', action.error)
                alert('회원정보 수정에 실패하였습니다.')
            } else {
                alert('회원정보가 수정되었습니다.')
                moveToPath('/mypage')
            }
        } catch (error){
            console.log('서버 요청 실패 : ', error);
        }
    }


    // 폼에서 데이터가 입력되었을 때마다 members 상태를 업데이트하는 함수
    const handleChangeMod = async (event) => {
        // members 업데이트
        const { name, value } = event.target;
        setMembers((prevParams) => ({
            ...prevParams,
            [name]: value,
        }));

        // 이름 값 검사
        if(name === 'memberName'){
            const name = event.target.value;
            name.trim()
            const regExp = /^[가-힣]{2,10}$/;
            if(regExp.test(name)){
                setIsNameValid(true)
            } else{
                setIsNameValid(false);
            }
        }

        // 핸드폰 번호 검사
        if (name === 'memberPhone'){
            const phoneNumber = event.target.value;
            const regExp = /^010-?([0-9]{4})-?([0-9]{4})$/;
            if(regExp.test(phoneNumber)){
                            const result = await phoneCheck(phoneNumber);
                            console.log('핸드폰 체크 : ' , result.msg);
                            if(result.msg == "1"){ // 해당 핸드폰 번호가 이미 존재하는가?
                                setIsPhoneValid(false);
                            } else {
                                setIsPhoneValid(true);
                            }
                        } else{
                            setIsPhoneValid(false);
                        }
        }

        // 생년월일 검사
        if (name === 'memberBirth'){
            const birth = event.target.value;
            console.log(birth)
            const regExp = /^[0-9]{8}$/;
            if(regExp.test(birth) && birth.length == 8){
                setIsMemBirthValid(true)
            }else{
                setIsMemBirthValid(false)
            }
        }

        // 성별 값 선택 검사
        if(name === 'memberGender'){
            setGender(event.target.value);
            setIsGenderValid(true); // 성별을 선택하면 유효성 검사 통과
        }

        // 지역 값 선택 검사
        if(name === 'memberLocal'){
            const selectedlocal = event.target.value;
            if (selectedlocal === "") {
                setIsLocalValid(false);
                setValidated(false);
            } else {
                setLocal(selectedlocal)
                setIsLocalValid(true);
            }
        }

    };

    return (

        <div>
            <div style={{marginTop:'20px'}}>
                <h3>회원정보 수정</h3>
            </div>
            <hr></hr>
            <div className={"modmemwrap"}>
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                {isSocial ? <div className="mb-3">✅소셜회원</div> : <p></p>}
                    {/* 이메일 */}
                    <Form.Group as={Row} className="mb-3" >
                        <Form.Label column sm={2}>
                            이메일
                        </Form.Label>
                        <Col sm={7}>
                            <Form.Control type="email"
                                          name="memberEmail"
                                          value={members.memberEmail}
                                          disabled
                            />
                        </Col>
                    </Form.Group>

                    {/* 이름 */}
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm={2}>
                            이름<span style={{color:'green', fontWeight:'bold'}}>*</span>
                        </Form.Label>
                        <Col sm={7}>
                            <Form.Control type="text"
                                          name="memberName"
                                          value={members.memberName}
                                          placeholder="이름을 입력하세요"
                                          required
                                          minLength={2}
                                          maxLength={10}
                                          onChange={handleChangeMod}
                                          isInvalid={!isNameValid}
                            />
                        </Col>
                    </Form.Group>

                    {/* 핸드폰번호 */}
                    <Form.Group as={Row} className="mb-3" >
                        <Form.Label column sm={2}>
                            핸드폰 번호<span style={{color: 'green', fontWeight: 'bold'}}>*</span>
                        </Form.Label>
                        <Col sm={7}>
                        <Form.Control type="text"
                                          name="memberPhone"
                                          value={members.memberPhone}
                                          required
                                          minLength={10}
                                          maxLength={11}
                                          pattern="^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$"
                                          onChange={handleChangeMod}
                                          Invalid={!isPhoneValid}
                            />
                            <Form.Control.Feedback type="invalid">
                                번호를 다시 확인해주세요.
                            </Form.Control.Feedback>
                        </Col>
                    </Form.Group>

                    {/* 성별 */}
                    <fieldset>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label as="legend" column sm={2}>
                                성별<span style={{color: 'green', fontWeight: 'bold'}}>*</span>
                            </Form.Label>
                            <Col sm={7}>
                            <Form.Check
                                    inline
                                    type="radio"
                                    label="남"
                                    name="memberGender"
                                    value={"M"}
                                    required
                                    id="formHorizontalRadios1"
                                    checked={members.memberGender === 'M'}
                                    onChange={handleChangeMod}
                                />
                                <Form.Check
                                    inline
                                    type="radio"
                                    label="여"
                                    name="memberGender"
                                    value={"W"}
                                    required
                                    id="formHorizontalRadios2"
                                    checked={members.memberGender === 'W'}
                                    onChange={handleChangeMod}
                                />
                                {!isGenderValid && (
                                    <div id="genderbox" style={{ color: "#dc3545", fontSize:"15px" }}>
                                        성별을 선택해주세요
                                    </div>
                                )}
                                <Form.Control.Feedback type="invalid">
                                    <div id="genderbox" style={{ color: "#dc3545", fontSize:"15px" }}>
                                        성별을 선택해주세요
                                    </div>
                                </Form.Control.Feedback>
                            </Col>
                        </Form.Group>
                    </fieldset>

                    {/* 생년월일 */}
                    <Form.Group as={Row} className="mb-3" >
                        <Form.Label column sm={2}>
                            생년월일<span style={{color: 'green', fontWeight: 'bold'}}>*</span>
                        </Form.Label>
                        <Col sm={7}>
                        <Form.Control type="text"
                                          name="memberBirth"
                                          value={members.memberBirth}
                                          placeholder="숫자만 입력해주세요 ex. 19990220"
                                          minLength={8}
                                          maxLength={8}
                                          required
                                          onChange={handleChangeMod}
                                          isInvalid={!isMemBirthValid}
                            />
                            <Form.Control.Feedback type="invalid">
                                생년월일을 다시 확인해주세요. (8자리 숫자)
                            </Form.Control.Feedback>
                        </Col>
                    </Form.Group>

                    {/* 지역 */}
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm={2}>
                            지역<span style={{color: 'green', fontWeight: 'bold'}}>*</span>
                        </Form.Label>
                        <Col sm={7}>
                        <Form.Select aria-label="local"
                                         name="memberLocal"
                                         value={members.memberLocal}
                                         required
                                         onChange={handleChangeMod}
                                         isInvalid={!isLocalValid}                            >
                                <option value="">선택해주세요</option>
                                <option value="서울">서울</option>
                                <option value="부산">부산</option>
                                <option value="대구">대구</option>
                                <option value="인천">인천</option>
                                <option value="광주">광주</option>
                                <option value="대전">대전</option>
                                <option value="울산">울산</option>
                                <option value="세종">세종</option>
                                <option value="경기">경기</option>
                                <option value="강원">강원</option>
                                <option value="충북">충북</option>
                                <option value="충남">충남</option>
                                <option value="전북">전북</option>
                                <option value="전남">전남</option>
                                <option value="경북">경북</option>
                                <option value="경남">경남</option>
                                <option value="제주">제주</option>
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                지역을 선택해주세요.
                            </Form.Control.Feedback>
                        </Col>
                    </Form.Group>
                </Form>
                <div className={"withdrawbox"}>
                    <span onClick={() => navigate('/mypage/withdraw')}>회원탈퇴</span>
                </div>
            </div>
            <div className="btnbox">
                <Button className={"loginbutton_default"} type="submit" onClick={handleSubmit} >회원정보 수정</Button>
            </div>
        </div>
    );
}


const MemberInfoPage = () => {
    const loginState = useSelector((state) => state.loginSlice)
    // console.log('loginState :' , loginState)
    const [showMemberInfo, setShowMemberInfo] = useState(false);

    const handleAuthSuccess = () => {
        setShowMemberInfo(true); // 비밀번호 인증 성공 시 회원정보 컴포넌트 표시
    };

    return (
        <div>
            {!showMemberInfo ? (
                <PasswordAuth onSuccess={handleAuthSuccess} />
            ) : (
                <MemberInfo />
            )}
        </div>
    );
};

export default MemberInfoPage;