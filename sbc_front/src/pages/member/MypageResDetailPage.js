import {useLocation, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {getResDetail} from "../../api/mypageApi";
import useCustomMove from "../../hooks/useCustomMove";
import "../../css/mypage.css"
import Button from 'react-bootstrap/Button';


const initState = {
    result :[],
}

const MypageResDetailPage = (props) => {

    const location = useLocation();
    const { refresh} = useCustomMove()
    const queryParams = new URLSearchParams(location.search);
    const resId = queryParams.get('resId');
    const [res, setRes] = useState(initState)
    const navigate = useNavigate()

    console.log('dddd', resId)

    useEffect(() => {
        getResDetail(resId).then((data) => {
            setRes(data);
            console.log('------res : ', res);
        }).catch((err) => {})
    }, [resId, refresh])

    const handleClick = () =>{
        navigate('/mypage/res')
    }

    return (
        <div style={{marginTop:'20px'}}>
            <h3>예약 번호 : {res.resId}</h3>
            <hr></hr>
            <div className="resdetailtablewrap">
                <table>
                    <tr>
                        <td>구역이름</td>
                        <td>{res.site && res.site.siteName ? res.site.siteName : <span>없음</span>}</td>
                    </tr>
                    <tr>
                        <td>예악자명</td>
                        <td>{res.resUserName}</td>
                    </tr>
                    <tr>
                        <td>핸드폰 번호</td>
                        <td>{res.resUserPhone}</td>
                    </tr>
                    <tr>
                        <td>예약 상태</td>
                        <td>{res.resStatus}</td>
                    </tr>
                    <tr>
                        <td>예약날짜</td>
                        <td>
                            {res.resStatus == '예약취소' ?
                                <span style={{textDecorationLine:'line-through'}}>{res.resDate}</span> : <span>{res.resDate}</span>
                            }
                            </td>
                    </tr>
                    <tr>
                        <td>입실날짜</td>
                        <td>{res.checkinDate}</td>
                    </tr>
                    <tr>
                        <td>퇴실날짜</td>
                        <td>{res.checkoutDate}</td>
                    </tr>
                    <tr>
                        <td>입실인원</td>
                        <td>{res.resPeople} 명</td>
                    </tr>
                    <tr>
                        <td>결제금액</td>
                        <td>{res.resTotalPay} 원</td>
                    </tr>
                </table>
                <div>
                    <Button variant="success" onClick={handleClick}>목록으로 돌아가기</Button>
                </div>
            </div>
        </div>
    )
}

export default MypageResDetailPage;