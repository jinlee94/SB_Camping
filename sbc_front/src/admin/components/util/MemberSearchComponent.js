import { useState } from "react";
import { Button } from 'react-bootstrap';

function MemberSearchComponent({ onSearch }) {
    const [type, setType] = useState('name');
    const [keyword, setKeyword] = useState('');
    const [placeholder, setPlaceholder] = useState('회원명을 입력하세요');

    const handleTypeChange = (event) => {
        const selectedType = event.target.value;

        setType(selectedType);

        switch (selectedType) {
            case 'name':
                setPlaceholder('회원명을 입력하세요');
                break;
            case 'phone':
                setPlaceholder('핸드폰 번호의 뒤 4자리를 입력하세요');
                break;
            case 'email':
                setPlaceholder('이메일을 입력하세요');
                break;
            default:
                setPlaceholder('');
        }
    };

    const handleSearch = () => {
        // 핸드폰 번호의 뒷자리 유효성 검사
        if (type === 'phone' && keyword.length !== 4) {
            alert('핸드폰 번호의 뒤 4자리를 정확히 입력하세요.');
            return; // 검색 실행을 중단
        }

        // 회원명 유효성 검사 (한글만 허용)
        if (type === 'name') {
            if (keyword.trim() === '') {
                alert('회원명 전체 또는 일부를 입력하세요.');
                return; // 검색 실행을 중단
            }
            const koreanRegex = /^[가-힣]+$/; // 한글만 허용하는 정규 표현식 (공백은 허용하지 않음)
            if (!koreanRegex.test(keyword)) {
                alert('회원명은 한글만 입력 가능합니다.');
                return; // 검색 실행을 중단
            }
        }

        // 이메일 유효성 검사
        if (type === 'email' && keyword.trim() === '') {
            alert('이메일 전체 또는 일부를 입력하세요.');
            return; // 검색 실행을 중단
        }
        // keyword가 공백인 경우 전체 목록 조회
        if (keyword.trim() === '') {
            onSearch(type, null); // 전체 목록 조회를 위해 null 또는 '' 전달
        } else {
            onSearch(type, keyword); // 검색 함수 호출
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSearch(); // 엔터 키 눌렀을 때 검색 실행
        }
    };

    return (
        <>
            <div className="d-flex align-items-center">
                <select id="type" name="type" value={type} onChange={handleTypeChange} className="me-2">
                    <option value="name">회원명</option>
                    <option value="phone">핸드폰</option>
                    <option value="email">이메일</option>
                </select>
                <input
                    id="keyword"
                    name="keyword"
                    type="text"
                    placeholder={placeholder}
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="form-control me-2 w-50" // Bootstrap의 form-control 클래스 추가
                />
                <Button onClick={handleSearch} style={{backgroundColor: "#457575", borderColor: "#457575"}}>조회</Button>
            </div>
        </>
    );
}

export default MemberSearchComponent;
