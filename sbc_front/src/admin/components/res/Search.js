import React from 'react';
import { Form } from 'react-bootstrap';
import PropTypes from 'prop-types';

// Search 컴포넌트: 검색어와 선택된 필드를 받아 필터링 기능을 제공하는 컴포넌트
const Search = ({ searchTerm, setSearchTerm, selectedColumn, setSelectedColumn }) => {




    // 검색에서 사용할 필드 목록 정의 (실제 값과 화면에 표시될 이름(라벨)을 함께 설정)
    const columns = [
        { value: 'resId', label: '예약 번호' },
        { value: 'resUserName', label: '예약자 이름' },
        { value: 'resUserPhone', label: '예약자 전화번호' },
        { value: 'resPeople', label: '인원수' },
        { value: 'checkinDate', label: '입실 날짜' },
        { value: 'checkoutDate', label: '퇴실 날짜' },
        { value: 'resDate', label: '예약 날짜' },
        { value: 'resTotalPay', label: '총 결제 금액' },
        { value: 'resCancelDate', label: '취소 날짜' },
        { value: 'resCancelReason', label: '취소 사유' },
        { value: 'member.memberName', label: '회원 이름' },
        { value: 'site.siteName', label: '구역 이름' },
    ];

    return (
        <div className="d-flex align-items-center mb-4">
            {/*셀렉 드롭다운*/}
            <Form.Select
                value={selectedColumn} // 선택된 필드의 값을 properties로 받아와 설정
                onChange={(e) => setSelectedColumn(e.target.value)} // 필드 선택 시 부모 컴포넌트로 선택 값 전달
                className="me-2" //css - 여백
                style={{ width: '150px' }} //css -너비
            >
                {/* 위에 columns배열을 옵션으로 설정*/}
                {columns.map(({ value, label }) => (
                    /*밸류를 기준으로 옵션을 생성하고 출력은 라벨을 보여줌*/
                    <option key={value} value={value}>
                        {label}
                    </option>
                ))}
            </Form.Select>

            {/* 검색어 입력 필드 */}
            <Form.Control
                type="text" // 텍스트 입력
                value={searchTerm} // 검색어 값을 properties로 받아와 설정
                onChange={(e) => setSearchTerm(e.target.value)} // 값이 변경되면 해당 밸류를 부모에 할당
                placeholder="검색어를 입력하세요" //텍스트창 들어갈 입력 유도 멘트
                className="me-2"
                style={{ width: '200px' }}
            />
        </div>
    );
};



// Search 컴포넌트가 받을 프로퍼티스의 타입 정의 -부모컴포넌트의 값을 사용
Search.propTypes = {
    searchTerm: PropTypes.string.isRequired, // 검색어 문자열 (필수)
    setSearchTerm: PropTypes.func.isRequired, // 검색어 설정 함수 (필수)
    selectedColumn: PropTypes.string.isRequired, // 선택된 필드 문자열 (필수)
    setSelectedColumn: PropTypes.func.isRequired, // 선택된 필드 설정 함수 (필수)
};

export default Search; // Search 컴포넌트 내보내기