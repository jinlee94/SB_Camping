import BasicLayout from '../layouts/BasicLayout';
import Button from 'react-bootstrap/Button';
import Carousel from 'react-bootstrap/Carousel';
import '../css/mainPage.css';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import axios from "axios";
import {useEffect, useState} from "react";

const MainPage = () => {

    const navigate = useNavigate();
    const [serverData, setServerData] = useState([]);
    const [error, setError] = useState(null); // 오류 상태 추가

    useEffect(() => {
        const getNotice = async () => {
            try {
                const data = await axios.get(`http://localhost:8080/admin/notices/main/list`);
                const result = data.data;
                //console.log(result);
                setServerData(result);
            } catch (err) {
                console.error(err); // 콘솔에 오류 로그
                setError('공지사항을 가져오는 데 문제가 발생했습니다. 서버를 확인해주세요.'); // 오류 메시지 설정
            }
        };
        getNotice();
    }, []);

    const formatDateYearMonth = (date) => {
        if (!date) return "";
        const yyyy = date.getFullYear();
        const MM = String(date.getMonth() + 1).padStart(2, '0');
        return `${yyyy}.${MM}`;
    };

    const formatDate = (date) => {
        if (!date) return "";
        const dd = String(date.getDate()).padStart(2, '0');
        return `${dd}`;
    };


    return (
        <BasicLayout>

            {/* 메인 사진 */}
            <Carousel>
                <Carousel.Item>
                    <div id='slider1'>
                        <div className='slider1_text'>
                            <h2>일상 속 힐링타임</h2>
                            <h5>행복한 추억과 낭만을 만들어가는 도덕산의 힐링 캠핑 명소</h5>
                        </div>
                    </div>
                </Carousel.Item>
                <Carousel.Item>
                    <div id='slider2'>
                        <div className='slider2_text'>
                            <h2>도덕산의 아름다운 풍경과 함께 하세요</h2>
                        </div>
                    </div>
                </Carousel.Item>
            </Carousel>

            {/* 중간 퀵메뉴*/}
            <ButtonGroup aria-label="Basic example" className='quickmenuwrap'>
                <Button variant="light" onClick={() => navigate('/res/realtime')}>실시간 예약</Button>
                <Button variant="light" onClick={() => navigate('/mypage/res')}>예약 확인</Button>
                <Button variant="light" onClick={() => navigate('/res/info')}>이용 요금 안내</Button>
                <Button variant="light" onClick={() => navigate('/camping/guide')}>시설안내도</Button>
                <Button variant="light" onClick={() => navigate('/camping/how')}>찾아오시는 길</Button>
            </ButtonGroup>

            {/* 서스펜션 브릿지 캠핑장 커뮤니티 */}
            <div className='text-center m-5'>
                <div className="communitywrap">
                    <h3>서스펜션 브릿지 캠핑장 커뮤니티</h3>
                    <div className='m-4'>
                        <h5>S U S P E N S I O N B R I D G E C A M P I N G</h5>
                    </div>
                </div>

                {/* 공지사항 */}

                <div id="main_board_left" className="wrap">
                    <div className="main_board_inner">
                        <div id="tabs">
                            <ul className="etabs">
                                <img width="50" height="50"
                                     src="https://img.icons8.com/?size=100&id=KLsuT6PnzOQL&format=png&color=000000"
                                     alt="error"/>
                                <li className="etl_01">
                                    <h5>공지사항</h5>
                                </li>
                            </ul>
                            <div id="tabs-1">
                                <ul className="board_list">
                                    {serverData && serverData.length > 0 ? (
                                            serverData.map(notice => (
                                                <li key={notice.nboardId}>
                                                    <a href={`/notices/read/${notice.nboardId}`}>
                                                        <p className="date_day"><span
                                                            className="big_day">{formatDate(new Date(notice.nboardDate))}</span>
                                                            <br/>{formatDateYearMonth(new Date(notice.nboardDate))}</p>
                                                        <h6>{notice.nboardTitle}</h6>
                                                        <span className="s_noti_desc">{notice.nboardContent}</span>
                                                    </a>
                                                </li>
                                            )))
                                        :
                                        <>공지사항을 불러오는 중입니다.</>

                                    }

                                </ul>
                            </div>

                            <div id="tabs-2">
                                <ul className="board_list">
                                </ul>
                            </div>
                        </div>

                        <div className="board_right">
                            <div className="facility">
                                <a href="/camping/guide">
                                    <h2>시설안내</h2>
                                    <p>
                                        <span>SB 캠핑장</span>에서<br/>
                                        원하시는정보를 찾아보세요!
                                    </p>
                                </a>
                            </div>
                            <div className="call">
                                <h2>문의 및 안내전화</h2>
                                <p className="call_number">
                                    031-1111-7777 <br/> 010-3113-1331
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                {error && <p>{error}</p>} {/* 오류 메시지 표시 */}
            </div>
            <div style={{marginBottom: '150px'}}></div>


        </BasicLayout>
    );
}

export default MainPage;