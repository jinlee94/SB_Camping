import Table from 'react-bootstrap/Table';
import {useSelector} from "react-redux";
import {Button} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import useCustomMove from "../../hooks/useCustomMove";
import BootstrapPagination from "../../admin/components/util/BootstrapPagination";
import axios from "axios";
import "../../css/lostItem.css";

const prefix = 'http://localhost:8080/api/lost'

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
}

const LostItemListPage = () => {

    const {page, size} = useCustomMove();
    const [refresh, setRefresh] = useState(false)
    const [currentPage, setCurrentPage] = useState(page); // 현재 페이지 상태
    const [serverData, setServerData] = useState(initState);
    const [searchParams, setSearchParams] = useState({type: 'name', keyword: ''});


    const [type, setType] = useState('category');
    const [keyword, setKeyword] = useState('');

    const loginState = useSelector(state => state.loginSlice);
    const email = loginState.member.memberEmail;
    const navigate = useNavigate();

    useEffect(() => {
        const listData = async () => {
            try {
                const data = searchParams.keyword
                    ? await axios.get(`${prefix}/search`,
                        {
                            params: {
                                page: currentPage,
                                size: size,
                                type: searchParams.type,
                                keyword: searchParams.keyword
                            }
                        })
                    : await axios.get(`${prefix}/list`, {params: {page: currentPage, size: size}});

                setServerData(data.data);
                console.log(data.data)
            } catch (error) {
                console.log(error);
            }
        }
        listData();
    }, [currentPage, size, searchParams, refresh]);

    const totalPages = serverData.totalPage;

    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > totalPages) return;
        setCurrentPage(newPage); // 현재 페이지를 업데이트
    };


    const handleTypeChange = (event) => {
        const selectedType = event.target.value;
        setType(selectedType);
    }

    const handleSearch = (type, keyword) => {
        setSearchParams({type, keyword});
        setCurrentPage(1); // 검색 시 페이지를 1로 초기화
    };


    /*
    *
    * 수정 시작
    *
    * */
    // 현재 수정 중인 itemId 상태 관리
    const [editingItemId, setEditingItemId] = useState(null);
    const [editCategory, setEditCategory] = useState('');
    const [editFoundLocation, setEditFoundLocation] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [editState, setEditState] = useState('');

    const startEditing = (item) => {
        setEditingItemId(item.itemId);
        setEditCategory(item.category); // 현재 카테고리를 기본값으로 설정
        setEditFoundLocation(item.foundLocation); // 현재 발견 위치 기본값 설정
        setEditDescription(item.description); // 현재 설명 기본값 설정
        setEditState(item.state); // 현재 상태를 기본값으로 설정
    };

    // 수정 후 저장 버튼
    const saveChanges = (itemId) => {
        // 수정 내용 저장 및 수정 모드 종료
        const lostItemDTO = {
            itemId:itemId,
            category: editCategory,
            foundLocation: editFoundLocation,
            description: editDescription,
            state: editState,
        }
        handleItemMod(itemId, lostItemDTO); // 새로운 값 전달
        setEditingItemId(null);
    };

    // 수정 취소
    const saveChangeCancel = () => {
        setEditingItemId(null)
    }

    // 수정 API 요청
    const handleItemMod = (itemId, lostItemDTO) => {
        console.log('--------------------', lostItemDTO)
        const confirmed = window.confirm('수정하시겠습니까?')
        if (confirmed) {
            // 수정 요청
            const modItem = async () => {
                try {
                    const header = {
                        headers:{'Content-Type': 'application/json'}
                    }
                    await axios.put(`${prefix}/${itemId}`, lostItemDTO, header)

                }catch (e) {
                    console.log(e)
                }
            }
            modItem();
            setRefresh(!refresh)
        }
    };
    /*
    *
    * 수정 끝
    *
    * */

    // 삭제 API 요청
    function handleDelete(itemId) {
        const confirmed = window.confirm('정말 삭제하시겠습니까?')
        if (confirmed) {
            // 삭제 요청
            const deleteItem = async () => {
                try {
                    await axios.delete(`${prefix}/${itemId}`)
                    alert('삭제 완료')
                } catch (error) {
                    console.log(error);
                }
            }
            deleteItem();
            window.location.reload();
        }
    }

    const [isOpen, setIsOpen] = useState(false); // 모달 열림 상태
    const [selectedImage, setSelectedImage] = useState(null); // 선택된 이미지

    const openModal = (image) => {
        setSelectedImage(image);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
        setSelectedImage(null);
    };

    const handleAddClick = () => {
            navigate('/admin/lost/add');
    };


    return (
        <>
            <div className="mt-3 mb-5">
                <h1>분실물 목록<span style={{fontSize:'14px'}}>　SB캠핑장 연락처 : 031-1111-7777</span></h1>
                <hr/>
            </div>

            <div className="d-flex mb-2 align-items-center">
                <div className="d-flex mb-2 align-items-center">
                    <select id="type" name="type" value={type} onChange={handleTypeChange}
                            className="form-select me-2"
                            style={{width: '150px'}}>
                        <option value="category">분류</option>
                        <option value="foundLocation">습득장소</option>
                    </select>
                    <input id="keyword" name="keyword" type="text" placeholder='검색어를 입력해주세요' value={keyword}
                           onChange={(e) => setKeyword(e.target.value)}
                           className="form-control me-2"
                           style={{width: '250px'}}/>
                    <Button onClick={() => handleSearch(type, keyword)} style={{backgroundColor:'#457575', border:'1px solid #457575'}}>검색</Button>
                </div>

            </div>
            <div>
            </div>
            <div>

                <Table hover style={{width: '100%', textAlign:'center', border:'1px solid #ddd'}} className="table-box">
                    <thead style={{textAlign:'center'}}>
                    <tr>
                        <th>번호</th>
                        <th>분류</th>
                        <th>등록일</th>
                        <th>습득장소</th>
                        <th>설명</th>
                        <th>보관상태</th>
                        <th>이미지</th>
                        {email === 'admin@sbc.com' ? <th>관리</th> : <></>}
                    </tr>
                    </thead>
                    <tbody style={{verticalAlign: 'middle', textAlign:'center'}}>
                    {serverData.dtoList && serverData.dtoList.length > 0 ? (
                        serverData.dtoList.map(item => (
                            <tr key={item.itemId}>
                                <td>{item.itemId}</td>
                                <td>{editingItemId === item.itemId ? (
                                    <input
                                        type="text"
                                        value={editCategory}
                                        style={{width: '90px', border: '1px solid grey'}}
                                        autoFocus
                                        maxLength={20}
                                        onChange={(e) => setEditCategory(e.target.value)}
                                    />
                                ) : (
                                    item.category
                                )}</td>
                                <td>{item.regDate}</td>
                                <td>{editingItemId === item.itemId ? (
                                    <input
                                        type="text"
                                        value={editFoundLocation}
                                        style={{width: '90px', border: '1px solid grey'}}
                                        maxLength={20}
                                        onChange={(e) => setEditFoundLocation(e.target.value)}
                                    />
                                ) : (
                                    item.foundLocation
                                )}</td>
                                <td>{editingItemId === item.itemId ? (
                                    <input
                                        type="text"
                                        value={editDescription}
                                        style={{width: '120px', border: '1px solid grey'}}
                                        maxLength={200}
                                        onChange={(e) => setEditDescription(e.target.value)}
                                    />
                                ) : (
                                    item.description
                                )}</td>

                                <td>{editingItemId === item.itemId ? (
                                    <select
                                        value={editState}
                                        onChange={(e) => setEditState(e.target.value)}
                                    >
                                        <option value="보관중">보관중</option>
                                        <option value="수령완료">수령완료</option>
                                    </select>
                                ) : (
                                    item.state
                                )}</td>
                                    <td>
                                        <img src={`${prefix}/view/${item.itemImage}`} style={{maxWidth: '150px', cursor:'pointer', margin: 'auto',
                                            display: 'block'}}
                                             alt="이미지"
                                             onClick={() => openModal(`${prefix}/view/${item.itemImage}`)}
                                        />
                                    </td>

                                    {isOpen && (
                                        <div className="modalStyles">
                                            <span className="closeButtonStyles" onClick={closeModal}>×</span>
                                            <img src={selectedImage} className="imageStyles" alt="확대 이미지"/>
                                        </div>
                                    )}

                                {/* 관리자 계정인 경우 수정, 삭제 버튼 추가*/}
                                {email === 'admin@sbc.com' ? (
                                    <td>
                                        {editingItemId === item.itemId ? (
                                            <>
                                                <Button size="sm" variant="success"
                                                        onClick={() => saveChanges(item.itemId)}>
                                                    저장
                                                </Button>
                                                <Button size="sm" variant="outline-dark"
                                                        onClick={saveChangeCancel} style={{marginLeft: '2px'}}>
                                                    취소
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <Button size="sm" variant="outline-success"
                                                        onClick={() => startEditing(item)}>수정</Button>
                                                <Button size="sm" variant="outline-danger"
                                                        onClick={() => handleDelete(item.itemId)}
                                                        style={{marginLeft: '2px'}}>삭제</Button>
                                            </>

                                        )}
                                    </td>
                                ) : null}</tr>
                        ))) : <tr>
                        <td colSpan="7">데이터가 없습니다.</td>
                    </tr>}
                    </tbody>
                </Table>

            </div>

            {/* 페이지네이션을 중앙 정렬하기 위해 div로 감싸기 */}
            <div className="d-flex justify-content-center my-4"> {/* my-4로 상하 여백 추가 */}
                <BootstrapPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>

            {email === 'admin@sbc.com' ? (
                <>
            <div className="d-flex justify-content-end mt-3 mb-5"> {/* mb-4 유지 */}
                <Button
                    onClick={handleAddClick}
                    className="btn btn-success"
                >
                    분실물 등록
                </Button>
            </div>
                </>) : null }
        </>
    )
}
export default LostItemListPage;