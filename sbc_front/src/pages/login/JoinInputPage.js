import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import {useState} from "react";
import {emailCheck, joinPost, phoneCheck} from "../../api/memberApi";
import useCustomLogin from "../../hooks/useCustomLogin";
import Modal from 'react-bootstrap/Modal';
import "../../css/join.css";
import ListGroup from "react-bootstrap/ListGroup";


const JoinInputPage = () => {

    // 부트스트랩 변수
    const [validated, setValidated] = useState(false);
    const [modalShow, setModalShow] = useState(false);

    const {moveToPath} = useCustomLogin()

    // 이름 유효성 검사용 변수
    const [isNameValid, setIsNameValid] = useState(true);
    // 생년월일 유효성 검사용 변수
    const [isMemBirthValid, setIsMemBirthValid] = useState(true);
    // 휴대폰번호 유효성 검사용 변수
    const [isPhoneValid, setIsPhoneValid] = useState(true);
    // 성별 유효성 검사용 변수
    const [gender, setGender] = useState("");
    const [isGenderValid, setIsGenderValid] = useState(true);
    // 지역 유효성 검사용 변수
    const [local, setLocal] = useState("");
    const [isLocalValid, setIsLocalValid] = useState(true);
    // 비밀번호 검사용 변수
    const [pwd, setPwd] = useState("");
    const [isPwdValid, setIsPwdValid] = useState(true);
    const [isPwdMatch, setIsPwdMatch] = useState(true);
    // 이메일 중복체크용 변수
    const [emailCheckResult, setEmailCheckResult] = useState("");
    const [isEmailValid, setIsEmailValid] = useState(true);

    const [members, setMembers] = useState(
        {
            memberEmail : '',
            memberPw : '',
            memberName : '',
            memberPhone : '',
            memberBirth : '',
            memberGender : '',
            memberLocal : ''
        })



    // 회원가입 버튼 눌렀을 때 동작
    const handleSubmit = (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        setValidated(true)
        //console.log('local : ', local);

        let valid = true;

        // 이메일 중복체크 여부
        if(emailCheckResult === "" || !isEmailValid){
            alert('이메일 중복체크를 해주세요.')
            valid = false;
            event.preventDefault();
        }

        // 비밀번호 재확인
        if (!isPwdMatch){
            valid = false;
            event.preventDefault();
        }
        if(!isPhoneValid){
            valid = false;
            event.preventDefault();
        }

        // 이름
        if(isNameValid === false){
            valid = false;
            event.preventDefault()
        }

        // 핸드폰 번호
        if(isPhoneValid === false ){
            valid = false;
            event.preventDefault()
        }

        // 라디오 버튼 선택 여부
        if (!gender) {
            setIsGenderValid(false);
            valid = false;
            event.preventDefault();
        } else {
            setIsGenderValid(true);
        }

        // 생년월일
        if(!isMemBirthValid){
            valid = false;
            event.preventDefault();
        }

        // 지역 선택 여부
        if (local === ""){
            valid = false;
            setIsLocalValid(false);
            event.preventDefault();
        }

        // 부트스트랩 동작
        if (form.checkValidity() === false || valid === false) {
            event.stopPropagation();
        } else{
            // 유효성 검사를 통과했으면 API 요청
            const confirm = window.confirm('해당 정보로 회원가입 하시겠습니까?')
            if(confirm){
                handleClickJoin(members)
            }
        }
    };

    // 유효성 검사를 모두 통과하면 회원가입 Submit 동작
    const handleClickJoin = async (members) => {
        try {
            const action = await joinPost(members);
            //console.log(action)
            if(action.error) {
                console.log('회원가입 실패')
                alert('회원가입 실패')
            } else {
                // 성공하면 가입 완료 페이지로 이동
                moveToPath('/join/welcome')
            }
        } catch (error){
            console.log('서버 요청 실패 : ', error);
        }
    }

    /*
    * 
    * 이메일 중복체크
    * 
    * */
    // 이메일 중복체크 메소드
    const handleEmailCheck = async (e) =>{
        const emailElement = document.getElementsByName("memberEmail");
        const email = emailElement[0].value;
        //console.log('1', email)
        
        // 이메일 유효성 검사 (간단한 정규 표현식 사용)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // 이메일 값이 비었거나 형식이 맞지 않으면 메시지 출력
        if (!emailRegex.test(email)) {
            // 이메일 값 초기화
            emailElement[0].value = '';
            // 사용 불가능한 이메일 메시지 설정
            alert('이메일 형식을 확인해주세요')
            // 모달 표시
            return
        }

        //console.log('2', email)
        // 이메일이 유효한 경우(이메일 형식인 경우) 중복체크
        try {
            // api 서버 호출
            const action = await emailCheck(email);
            setModalShow(true)
            //console.log('3', email)

            if(action.msg === 'enable'){
                setEmailCheckResult('사용 가능한 이메일입니다.');
                setIsEmailValid(true)
            } else if (action.msg === 'disable' || email === ''){
                setEmailCheckResult(<>
                    사용 <span style={{ color: 'red'}}>불가능</span>한 이메일입니다.
                </>);
                emailElement[0].value = '';
                setIsEmailValid(false)
            } else{
                setEmailCheckResult('이메일 중복 체크 중 오류가 발생했습니다.')
                setIsEmailValid(false)
            }
        } catch (error) {
            setEmailCheckResult('이메일 중복 체크 중 오류가 발생했습니다.')
        }
    }

    // 모달 (부트스트랩) 이메일 중복체크 결과
    function MyVerticallyCenteredModal(props) {
        return (
            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        이메일 중복체크 결과
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p style={{textAlign:'center', marginTop:'10px'}}>
                        {props.emailCheckResult}
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={props.onHide}>닫기</Button>
                </Modal.Footer>
            </Modal>
        );
    }
    /*
    * 
    * 이메일 중복체크 끝
    * 
    * */

    // 폼에서 데이터가 입력되었을 때마다 members 상태를 업데이트하는 함수
    const handleChangeJoin = async (event) => {
        // members 업데이트
        const { name, value } = event.target;
        setMembers((prevParams) => ({
            ...prevParams,
            [name]: value,
        }));

        //console.log(local);

        // 비밀번호 유효성 검사
        if(name === 'memberPw'){
            setPwd(event.target.value);
            const regExp = /^(?=.*[a-z])((?=.*\d)(?=.*\W)).{10,15}$/;
            if(regExp.test(event.target.value)){
                setIsPwdValid(true);
            } else{
                setIsPwdValid(false);
            }
        }

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
            //console.log(birth)
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


    /* 비밀번호 재확인 */
    const handleConfirmPwd = (event) => {
        const confirmPwd = event.target.value;
        setIsPwdMatch(confirmPwd === pwd);
        if(pwd !== confirmPwd){
            setIsPwdMatch(false);
        } else {
            setIsPwdMatch(true);
        }
    }


    return (
        <div>
            <ListGroup horizontal>
                <ListGroup.Item>이용약관</ListGroup.Item>
                <ListGroup.Item><b>정보입력</b></ListGroup.Item>
                <ListGroup.Item>가입완료</ListGroup.Item>
            </ListGroup>
            <div className={"joininputwrap"}>
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    {/* 이메일 */}
                    <Form.Group as={Row} className="mb-3" >
                        <Form.Label column sm={3}>
                            이메일<span style={{color: 'green', fontWeight: 'bold'}}>*</span>
                        </Form.Label>
                        <Col sm={5}>
                        <Form.Control type="email"
                                          name="memberEmail"
                                          placeholder="이메일을 입력하세요"
                                          required
                                          maxLength={50}
                                          onChange={handleChangeJoin}
                                          isInvalid={!isEmailValid}
                            />
                            <Form.Control.Feedback type="invalid">
                                이메일 형식 확인 또는 이메일 중복체크를 해주세요
                            </Form.Control.Feedback>

                        </Col>
                        <Col sm={2}>
                            <Button onClick={handleEmailCheck} style={{fontSize:'13px', background:'darkslategrey', border:"1px solid darkslategrey"}}>중복체크</Button>
                            <MyVerticallyCenteredModal
                                show={modalShow}
                                onHide={() => setModalShow(false)}
                                emailCheckResult={emailCheckResult}
                            />
                        </Col>
                    </Form.Group>

                    {/* 비밀번호 */}
                    <Form.Group as={Row} className="mb-3" >
                        <Form.Label column sm={3}>
                            비밀번호<span style={{color: 'green', fontWeight: 'bold'}}>*</span>
                        </Form.Label>
                        <Col sm={7}>
                        <Form.Control type="password"
                                          name="memberPw"
                                          placeholder="영문소문자, 숫자, 특수문자 포함 10-15자"
                                          required
                                          id={"password"}
                                          minLength={10}
                                          maxLength={15}
                                          pattern={"^(?=.*[a-z])((?=.*\\d)|(?=.*\\W)).{10,15}$"}
                                          onChange={handleChangeJoin}
                                          isInvalid={!isPwdValid}
                            />
                            <Form.Control.Feedback type="invalid">
                                비밀번호를 확인해주세요.
                            </Form.Control.Feedback>
                        </Col>
                    </Form.Group>

                    {/* 비밀번호 재확인 */}
                    <Form.Group as={Row} className="mb-3" >
                        <Form.Label column sm={3}>
                            비밀번호 확인<span style={{color: 'green', fontWeight: 'bold'}}>*</span>
                        </Form.Label>
                        <Col sm={7} id={"pwrebox"}>
                        <Form.Control type="password"
                                          placeholder="영문소문자, 숫자, 특수문자 포함 10-15자"
                                          required
                                          id={"password_re"}
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


                    {/* 이름 */}
                    <Form.Group as={Row} className="mb-3" >
                        <Form.Label column sm={3}>
                            이름<span style={{color: 'green', fontWeight: 'bold'}}>*</span>
                        </Form.Label>
                        <Col sm={7}>
                        <Form.Control type="text"
                                          name="memberName"
                                          placeholder="이름을 입력하세요"
                                          required
                                          minLength={2}
                                          maxLength={10}
                                          pattern="^[가-힣]{2,10}$"
                                          onChange={handleChangeJoin}
                                          isInvalid={!isNameValid}
                            />
                            <Form.Control.Feedback type="invalid">
                                이름을 확인해주세요.
                            </Form.Control.Feedback>
                        </Col>
                    </Form.Group>

                    {/* 핸드폰번호 */}
                    <Form.Group as={Row} className="mb-3" >
                        <Form.Label column sm={3}>
                            핸드폰 번호<span style={{color: 'green', fontWeight: 'bold'}}>*</span>
                        </Form.Label>
                        <Col sm={7}>
                        <Form.Control type="text"
                                          name="memberPhone"
                                          placeholder="-없이 숫자만 입력해주세요"
                                          required
                                          minLength={10}
                                          maxLength={11}
                                          onChange={handleChangeJoin}
                                          isInvalid={!isPhoneValid}
                            />
                            <Form.Control.Feedback type="invalid">
                                핸드폰 번호가 형식에 맞지 않거나 중복된 번호입니다.
                            </Form.Control.Feedback>
                        </Col>
                    </Form.Group>

                    {/* 성별 */}
                    <fieldset>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label as="legend" column sm={3}>
                                성별<span style={{color: 'green', fontWeight: 'bold'}}>*</span>
                            </Form.Label>
                            <Col sm={7}>
                            <Form.Check
                                    inline
                                    type="radio"
                                    label="남"
                                    name="memberGender"
                                    value={"M"}
                                    id="formHorizontalRadios1"
                                    onChange={handleChangeJoin}
                                />
                                <Form.Check
                                    inline
                                    type="radio"
                                    label="여"
                                    name="memberGender"
                                    value={"W"}
                                    id="formHorizontalRadios2"
                                    onChange={handleChangeJoin}
                                />
                                {!isGenderValid && (
                                    <div id="genderbox" style={{ color: "#dc3545", fontSize:"15px" }}>
                                        성별을 선택해주세요
                                    </div>
                                )}
                            </Col>
                        </Form.Group>
                    </fieldset>

                    {/* 생년월일 */}
                    <Form.Group as={Row} className="mb-3" >
                        <Form.Label column sm={3}>
                            생년월일<span style={{color: 'green', fontWeight: 'bold'}}>*</span>
                        </Form.Label>
                        <Col sm={7}>
                        <Form.Control type="text"
                                          name="memberBirth"
                                          placeholder="숫자만 입력해주세요 ex. 19990220"
                                          minLength={8}
                                          maxLength={8}
                                          required
                                          pattern="^[0-9]{8}$"
                                          onChange={handleChangeJoin}
                                          isInvalid={!isMemBirthValid}
                            />
                            <Form.Control.Feedback type="invalid">
                                생년월일을 다시 확인해주세요. (8자리 숫자)
                            </Form.Control.Feedback>
                        </Col>
                    </Form.Group>

                    {/* 지역 */}
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm={3}>
                            지역<span style={{color: 'green', fontWeight: 'bold'}}>*</span>
                        </Form.Label>
                        <Col sm={7}>
                        <Form.Select aria-label="local"
                                         name="memberLocal"
                                         required
                                         onChange={handleChangeJoin}
                                         isInvalid={!isLocalValid}
                            >
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
                <div className="joinButton">
                    <button type="submit" onClick={handleSubmit} style={{background:'darkslategrey', border:'1px solid darkslategrey'}}>회원가입</button>
                </div>
            </div>
        </div>
    );
}

export default JoinInputPage;