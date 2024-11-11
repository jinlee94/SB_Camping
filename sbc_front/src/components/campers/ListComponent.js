import { useEffect, useState } from "react";
import { getList, getSearchList } from "../../api/camperApi";
import useCustomMove from "../../hooks/useCustomMove";
import PageComponent from "../common/PageComponent";
import useCustomLogin from "../../hooks/useCustomLogin";
import fileImage from "../../images/fileAttatchment.png";
import { getCommentList } from "../../api/camperApi";
import {Button} from "react-bootstrap";
import Table from "react-bootstrap/Table"; // 댓글 수 가져오기 위한 API import

const initState = {
    dtoList: [],
    pageNumList: [],
    pageRequestDTO: null,
    prev: false,
    next: false,
    totalCount: 0,
    prevPage: 0,
    nextPage: 0,
    totalPage: 0,
    current: 0,
};

const ListComponent = () => {
    const { page, size, refresh, moveToList, moveToRead, moveToAdd } = useCustomMove();
    const { exceptionHandle } = useCustomLogin();
    const [serverData, setServerData] = useState(initState);
    const [searchType, setSearchType] = useState("title");
    const [searchText, setSearchText] = useState("");
    const [commentCounts, setCommentCounts] = useState({}); // 각 게시글의 댓글 개수 상태

    // 데이터 로딩 함수
    const loadData = async () => {
        let data;
        if (searchText) {
            const searchParam = { page, size, searchType, searchText };
            data = await getSearchList(searchParam);
        } else {
            data = await getList({ page, size });
        }

        setServerData(data);

        // 댓글 갯수 가져오기
        const counts = await Promise.all(
            data.dtoList.map(async (camperBoard) => {
                const commentsData = await getCommentList(camperBoard.cboardID);
                return { cboardID: camperBoard.cboardID, count: commentsData.length || 0 }; // 댓글이 없으면 0으로 처리
            })
        );

        // 댓글 개수 상태 업데이트
        const countsMap = counts.reduce((acc, { cboardID, count }) => {
            acc[cboardID] = count;
            return acc;
        }, {});
        setCommentCounts(countsMap); // 상태에 저장
    };

    // 초기 데이터 로딩
    useEffect(() => {
        loadData();
    }, [page, size, refresh]); // 초기 로드 시에만 호출

    const handleReadPage = (cBoardId) => {
        console.log("Selected cBoardId:", cBoardId); // cBoardId 확인
        if (!cBoardId) {
            console.error("cBoardId is undefined or invalid."); // ID가 유효하지 않을 때 처리
            return;
        }

        moveToRead(cBoardId);
    };

    const truncateTitle = (title) => {
        return title.length > 28 ? title.slice(0, 28) + "..." : title;
    };

    // 날짜 포맷팅
    const formatDate = (date) => {
        if (!date) return ""; // date가 null인 경우 빈 문자열 반환
        const localDate = new Date(date);
        const yyyy = localDate.getFullYear();
        const MM = String(localDate.getMonth() + 1).padStart(2, '0');
        const dd = String(localDate.getDate()).padStart(2, '0');

        return `${yyyy}-${MM}-${dd}`;
    };

    const handleSearch = () => {
        loadData(); // 검색 실행
    };

    return (
        <div className="container mt-5">

            <div className="d-flex mb-3 align-items-center">
                <select
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                    className="form-select me-2"
                    style={{width: '150px'}} // 드롭다운 크기 조정
                >
                    <option value="title">제목</option>
                    <option value="content">내용</option>
                </select>
                <input
                    type="text"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="form-control me-2"
                    placeholder="검색어를 입력해주세요"
                    style={{width: '250px'}} // 입력창 크기 조정
                />
                <button
                    className="btn btn-primary"
                    onClick={handleSearch}
                    style={{backgroundColor:'#457575', border:'1px solid #457575'}}// 검색 실행
                >
                    검색
                </button>
            </div>

            <Table bordered hover responsive className="text-sm-center">
                <thead>
                <tr>
                    <th style={{ width: '10%', backgroundColor:'#537f91', color:"white" }}>NO</th>
                    <th style={{ width: '40%', backgroundColor:'#537f91', color:"white" }}>제목</th>
                    <th style={{ width: '20%', backgroundColor:'#537f91', color:"white" }}>작성자</th>
                    <th style={{ width: '15%', backgroundColor:'#537f91', color:"white" }}>작성일</th>
                    <th style={{ width: '15%', backgroundColor:'#537f91', color:"white" }}>조회수</th>
                </tr>
                </thead>
                <tbody>
                {serverData.dtoList.length > 0 ? (
                    serverData.dtoList.map((camperBoard) => (
                        <tr
                            key={camperBoard.cboardID}
                            onClick={() => handleReadPage(camperBoard.cboardID)}
                            style={{cursor: "pointer"}}
                        >
                            <td>{camperBoard.cboardID}</td>
                            <td className="d-flex align-items-center">
                               <span
                                   className="badge me-2"
                                   style={{
                                       display: "inline-block",
                                       backgroundColor: camperBoard.cboardCategory === "잡담" ? "orange" : "green", // '잡담'은 주황색, 그 외는 초록색 배경
                                       color: "white", // 모든 카테고리에 흰색 글씨
                                   }}
                               >
    {camperBoard.cboardCategory}
</span>

                                <span style={{display: "inline-block"}}>
                                    {truncateTitle(camperBoard.cboardTitle)}
                                </span>
                                {camperBoard.cboardAttachment && (
                                    <img
                                        src={fileImage}
                                        alt="첨부 이미지"
                                        className="ms-2"
                                        style={{
                                            width: '1em', // 글자 크기에 맞춰 조정
                                            height: '1em', // 글자 크기에 맞춰 조정
                                        }}
                                    />
                                )}
                                <span className="text-red-500 ms-2">
                                    [{commentCounts[camperBoard.cboardID] || 0}]
                                </span>
                            </td>
                            <td>{camperBoard.membername}</td>
                            <td>
                                {formatDate(new Date(camperBoard.cboardDate))}
                            </td>
                            <td>{camperBoard.cboardViews}</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="5">게시물이 없습니다.</td>
                    </tr>
                )}
                </tbody>
            </Table>
                <div className="d-flex justify-content-center my-4">
                    <PageComponent serverData={serverData} movePage={moveToList}/>
                </div>
            <div className="d-flex justify-content-end mt-3 mb-5">
                <Button className="btn btn-success" onClick={() => moveToAdd()}>
                    글쓰기
                </Button>
            </div>
        </div>
    );
};

export default ListComponent;
