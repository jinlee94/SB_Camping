import "../../css/join.css";
import Button from 'react-bootstrap/Button';
import {useNavigate} from "react-router-dom";
import ListGroup from 'react-bootstrap/ListGroup';

const JoinCompletePage = () =>{

    const navigate = useNavigate();

    const handleButtonClick = (e) => {
        navigate("/login");
    }

    return(
        <div>
            <ListGroup horizontal>
                <ListGroup.Item>이용약관</ListGroup.Item>
                <ListGroup.Item>정보입력</ListGroup.Item>
                <ListGroup.Item><b>가입완료</b></ListGroup.Item>
            </ListGroup>
            <div className="comwrap">
                <h4>회원가입이 완료되었습니다.</h4>
                Suspension Bridge 캠핑장 회원이 되신 것을 환영합니다.<br></br>
                실시간 예약과 커뮤니티 게시판을 이용하실 수 있습니다.
            </div>
            <div className="buttonwrap">
                <Button variant="success" onClick={handleButtonClick}>로그인</Button>
            </div>
        </div>
    );
}

export default JoinCompletePage;