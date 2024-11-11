import useCustomMove from '../../../hooks/useCustomMove';
import React, { useEffect, useState } from 'react';
import { getFullList, searchMember } from '../../api/A_memberApi';
import MemberSearchComponent from '../util/MemberSearchComponent';
import BootstrapPagination from "../util/BootstrapPagination";
import Table from 'react-bootstrap/Table';

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
    current: 0
};

function TotalListComponent(props) {
    const { page, size, moveToList } = useCustomMove();
    const [currentPage, setCurrentPage] = useState(page); // 현재 페이지 상태
    const [serverData, setServerData] = useState(initState);
    const [searchParams, setSearchParams] = useState({ type: 'name', keyword: ''});

    useEffect(() => {
        console.log("Fetching data for page:", currentPage);
        const fetchData = async () => {
            try {
                const data = searchParams.keyword
                    ? await searchMember(searchParams.type, searchParams.keyword, { page: currentPage, size })
                    : await getFullList({ page: currentPage, size });

                console.log("Fetched data:", data);
                setServerData(data);
            } catch (error) {
                console.error('API 호출 중 오류 발생:', error);
            }
        };

        fetchData();
    }, [currentPage, size, searchParams]);

    const handleSearch = (type, keyword) => {
        setSearchParams({ type, keyword}); // 검색 파라미터 설정
    };

    // 페이지네이션
    const totalPages = serverData.totalPage; // 총 페이지 수

    const handlePageChange = (newPage) => {
        console.log("Changing to page:", newPage);
        setCurrentPage(newPage);
    };

    const formatDate = (date) => {
        const yyyy = date.getFullYear();
        const MM = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
        const dd = String(date.getDate()).padStart(2, '0');

        return `${yyyy}${MM}${dd}`;
    };

    return (
        <div>
            <div>
                <h1>전체 회원 리스트 </h1>
                <hr/>
                <MemberSearchComponent onSearch={handleSearch} />
                <hr/>
            </div>
            <Table bordered hover responsive className="text-sm-center">
                <thead className="bg-secondary text-white">
                <tr>
                    <th>회원번호</th>
                    <th>이메일</th>
                    <th>이름</th>
                    <th>핸드폰 번호</th>
                    <th>성별</th>
                    <th>생년월일</th>
                    <th>지역</th>
                    <th>가입일</th>
                    <th>휴면회원여부</th>
                </tr>
                </thead>
                <tbody>
                {serverData.dtoList.length === 0 ? ( // 데이터가 없을 경우 메시지 표시
                    <tr>
                        <td colSpan="9" className="text-center">조회된 데이터가 없습니다.</td>
                    </tr>
                ) : (
                    serverData.dtoList
                        .filter(member => member.memberRole !== 'ROLE_ADMIN') // 'ROLE_ADMIN'이 아닌 경우만 필터링
                        .map(member => (
                            <tr key={member.memberID}>
                                <td>{member.memberID}</td>
                                <td>{member.memberEmail}</td>
                                <td>{member.memberName}</td>
                                <td>{member.memberPhone}</td>
                                <td>{member.memberGender}</td>
                                <td>{member.memberBirth}</td>
                                <td>{member.memberLocal}</td>
                                <td>{formatDate(new Date(member.memberRegDate))}</td>
                                <td style={{
                                    color: member.memberStatus.trim().toUpperCase() === "X" ? 'red' :
                                        member.memberStatus.trim().toUpperCase() === "OFF" ? 'blue' : 'black'
                                }}>
                                    {member.memberStatus.trim().toUpperCase() === "ON" ? '' :
                                        member.memberStatus.trim().toUpperCase() === "X" ? '탈퇴' :
                                            member.memberStatus.trim().toUpperCase() === "OFF" ? '휴면' : ''}
                                </td>
                            </tr>
                        ))
                )}
                </tbody>
            </Table>
            <BootstrapPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
}

export default TotalListComponent;