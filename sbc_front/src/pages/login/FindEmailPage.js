import BasicLayout from "../../layouts/BasicLayout";
import LoginMenu from "../../layouts/LoginMenu";
import {useState} from "react";
import '../../css/login.css'
import {findEmail} from "../../api/memberApi";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

// 부트스트랩 모달
function MyVerticallyCenteredModal(props) {
    console.log(props.emailResult)
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    이메일 찾기
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p style={{textAlign:'center', marginTop:'10px'}}>
                    {props.emailResult}
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>닫기</Button>
            </Modal.Footer>
        </Modal>
    );
}


const FindEmailPage = () => {

    const [modalShow, setModalShow] = useState(false);
    const [emailResult, setEmailResult] = useState('');
    const [member, setMembers] = useState({memberName : '', memberPhone : ''})

    const handleChange = (e) => {
        setMembers({ ...member, [e.target.name]: e.target.value });
    }

    // '이메일 찾기' 버튼 눌렀을 때 동작 (핸드폰 번호 유효성 확인)
    const handleSubmit = (e) => {

        if(!member.memberName){
            alert('이름을 입력해주세요')
            e.preventDefault()
            return
        }

        // 핸드폰번호가 숫자 값으로만 되어있는지 확인
        if(!member.memberPhone){
            alert('핸드폰 번호를 입력해주세요')
            e.preventDefault()
        } else{
            const phone = member.memberPhone;
            const regExp = /^[\d]*$/;
            if(!(regExp.test(phone))){
                alert('핸드폰번호를 확인해주세요');
                e.preventDefault();
            } else if(phone.length != 11){
                alert('핸드폰번호를 확인해주세요');
                e.preventDefault();
            } else{
                // 이상 없으면 이메일 찾기 실행
                handleFindEmailByNameAndPhone(member);
            }
        }
    }

    // 이메일 찾기 API 요청
    const handleFindEmailByNameAndPhone = async (member) => {
        try {
            const action = await findEmail(member);
            console.log(action);
            if(action.error){
                console.log('이메일 찾기 에러')
                setEmailResult(<>
                    이메일을 찾을 수 없습니다.
                </>)
                setModalShow(true)
            } else {
                console.log('동작완료------', action.memberEmail);
                setEmailResult(action.memberEmail);
                setModalShow(true)
            }
        } catch (error) {
            console.log('서버 요청 실패', error.message);
            setEmailResult(<>
                이메일을 찾을 수 없습니다.
            </>)
            setModalShow(true)
        }
    }

    return(
        <BasicLayout>
            <LoginMenu/>
            <div style={{marginTop: '20px'}}>
                <h3>이메일 찾기</h3>
                <hr></hr>
            </div>
            <div id="loginwrap">
                <div id="loginbox">
                    <input type="text"
                           name="memberName"
                           value={member.memberName}
                           required
                           maxLength={'10'}
                           onChange={handleChange}
                           placeholder={" 이름을 입력해주세요"}></input><br></br>
                    <input type="text"
                           name="memberPhone"
                           value={member.memberPhone}
                           maxLength={'11'}
                           required
                           onChange={handleChange}
                           style={{fontSize: '14px'}}
                           placeholder={" 핸드폰 번호를 입력해주세요. (-없이 숫자만)"}></input>
                    <div>
                        <input type="submit" onClick={handleSubmit} className={"loginbutton_default"}
                               value="이메일 찾기"></input>
                        <MyVerticallyCenteredModal
                            show={modalShow}
                            onHide={() => setModalShow(false)}
                            emailResult={emailResult}
                        />
                    </div>
                </div>
            </div>
        </BasicLayout>
    );
}

export default FindEmailPage;