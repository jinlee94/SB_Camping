import React, {useEffect, useRef, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {useSelector} from "react-redux";
import {getOne, PutOne} from "../../api/reviewApi";
import {prefix} from "../../api/camperApi";
import ToggleButton from "react-bootstrap/ToggleButton";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";


const ReviewModifyComponent = () => {

    const initState = {
        reviewTitle: '',
        reviewContent: '',
        file: null,
        reviewAttachment: '',
        rtag_Clean: '',
        rtag_Price: '',
        rtag_Facility: '',
        rtag_Photo: '',
        rtag_Silence: '',
        rtag_Kind: '',
        rtag_View: '',
    }

    const {reviewID} = useParams();
    const navigate = useNavigate();
    const [review, setReview] = useState(initState);
    const uploadRef = useRef()
    const [showDeleteButton, setShowDeleteButton] = useState(true);
    const [imageLoadError, setImageLoadError] = useState(false);

    // 태그 선택
    const [value, setValue] = useState([]);

    const loginState = useSelector((state) => state.loginSlice)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getOne(reviewID)
                console.log(reviewID)

                // 데이터 구조 확인 후 상태 설정
                setReview({
                    reviewTitle: data.reviewTitle || '',
                    reviewContent: data.reviewContent || '',
                    reviewAttachment: data.reviewAttachment || null,
                    file: null,
                    rtag_Clean: data.rtag_Clean || '',
                    rtag_Price: data.rtag_Price || '',
                    rtag_Facility: data.rtag_Facility || '',
                    rtag_Photo: data.rtag_Photo || '',
                    rtag_Silence: data.rtag_Silence || '',
                    rtag_Kind: data.rtag_Kind || '',
                    rtag_View: data.rtag_View || '',
                });

                // 현재 로그인 중인 유저와 글 작성자의 ID를 비교
                if (data.member?.memberID && loginState.member?.memberId) {
                    if (data.member.memberID !== loginState.member.memberId) {
                        navigate("/review/list")
                    }
                }
            } catch (error) {
                console.error("Failed to fetch qna data", error);
                // navigate("") 아직 ㄴㄴ
            }
        };
        if (loginState && loginState.member) {
            fetchData()
        }
    }, [reviewID, loginState]);

    useEffect(() => {
        const selectValues  = [];

        if (review.rtag_Clean === 'Y') {
            selectValues.push('1');
        }
        if (review.rtag_Price === 'Y') {
            selectValues.push('2');
        }
        if (review.rtag_Facility === 'Y') {
            selectValues.push('3');
        }
        if (review.rtag_Photo === 'Y') {
            selectValues.push('4');
        }
        if (review.rtag_Silence === 'Y') {
            selectValues.push('5');
        }
        if (review.rtag_Kind === 'Y') {
            selectValues.push('6');
        }
        if (review.rtag_View === 'Y') {
            selectValues.push('7');
        }

        setValue(selectValues)

    }, [review]);

    // 태그 선택시 상태 업데이트
    const handleChange = (val) => {
        setValue(val)
        setReview((prev) => ({
            ...prev,
            rtag_Clean: val.includes('1') ? 'Y' : 'N',
            rtag_Price: val.includes('2') ? 'Y' : 'N',
            rtag_Facility: val.includes('3') ? 'Y' : 'N',
            rtag_Photo: val.includes('4') ? 'Y' : 'N',
            rtag_Silence: val.includes('5') ? 'Y' : 'N',
            rtag_Kind: val.includes('6') ? 'Y' : 'N',
            rtag_View: val.includes('7') ? 'Y' : 'N',
        }))
    }

    const handleChangeReview = (e) => {
        const {name, value} = e.target;
        setReview(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleFileChange = (e) => {
        setReview(prev => ({
            ...prev,
            file: e.target.files[0]
        }));
    }

    const deleteOldImage = () => {
        setReview(prev => ({
            ...prev,
            reviewAttachment: null
        }))
        setShowDeleteButton(false) // 버튼 숨기기
    }

    const handleClickModify = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("reviewTitle", review.reviewTitle)
        formData.append("reviewContent", review.reviewContent)

        // 태그 값들도 추가
        formData.append("rtag_Clean", review.rtag_Clean);
        formData.append("rtag_Price", review.rtag_Price);
        formData.append("rtag_Facility", review.rtag_Facility);
        formData.append("rtag_Photo", review.rtag_Photo);
        formData.append("rtag_Silence", review.rtag_Silence);
        formData.append("rtag_Kind", review.rtag_Kind);
        formData.append("rtag_View", review.rtag_View);

        console.log("사진", review.reviewAttachment);

        // 파일 처리
        if (review.file) {
            formData.append("file", review.file) // 새로운 파일
        } else {
            // 현재 첨부파일 상태 처리
            if (review.reviewAttachment === null || review.reviewAttachment === '') {
                formData.append("reviewAttachment", null); // 기존 파일 삭제시 null
            } else {
                formData.append("reviewAttachment", review.reviewAttachment);
            }
        }

        try {
            await PutOne(reviewID, formData);
            alert("게시글 수정 완료")
            navigate(`/review/read/${reviewID}`)
        } catch (error) {
            alert(error.message);
            console.error("Error uploading", error)
        }
    }

    return (
        <>
            <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-md border-2 border-gray-400 space-y-4 mb-40">

                <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-2">제목</h3>
                    <input
                        name="reviewTitle"
                        type="text"
                        value={review.reviewTitle} // 제목
                        onChange={handleChangeReview}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="mb-8">
                <h3 className="text-lg font-semibold mb-2">내용</h3>
                    <textarea
                        name="reviewContent"
                        value={review.reviewContent} // 내용
                        onChange={handleChangeReview}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"

                        rows="5"
                    />
                </div>
                <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-2">이미지 업로드</h3>
                    <input
                        type="file"
                        ref={uploadRef}
                        name="file"
                        onChange={handleFileChange} // 파일 선택 시 호출
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                {review.reviewAttachment && review.reviewAttachment.trim() !== "" && !imageLoadError ? (
                    <div>
                        <h3 className="text-lg font-semibold mb-2">첨부 이미지</h3>
                        {showDeleteButton && (
                            <div>
                                <button type="button" onClick={deleteOldImage}>X</button>
                                <img
                                    src={`${prefix}/view/s_${review.reviewAttachment}`}
                                    alt="게시물 첨부 이미지"
                                    className="rounded-lg"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        setImageLoadError(true); // 새로운 상태 변수를 사용하여 이미지 로드 실패를 추적
                                    }}
                                    style={{
                                        marginBottom: "20px"
                                    }}
                                />
                            </div>
                        )}
                    </div>
                ) : (
                    <p className="text-gray-500"></p>
                )}
                <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-2">태그 선택</h3>
                    <div className="w-full px-4 py-2 border rounded-lg">
                        <ToggleButtonGroup type="checkbox" value={value} onChange={handleChange}>
                            <ToggleButton id="tbg-btn-1" value={'1'} variant="outline-primary" style={{
                                borderRadius: "50px"
                            }}>#청결해요</ToggleButton>&nbsp;&nbsp;
                            <ToggleButton id="tbg-btn-2" value={'2'} variant="outline-danger" style={{
                                borderRadius: "50px"
                            }}>#가성비가 좋아요</ToggleButton>&nbsp;&nbsp;
                            <ToggleButton id="tbg-btn-3" value={'3'} variant="outline-warning" style={{
                                borderRadius: "50px"
                            }}>#시설이 좋아요</ToggleButton>&nbsp;&nbsp;
                            <ToggleButton id="tbg-btn-4" value={'4'} variant="outline-dark" style={{
                                borderRadius: "50px"
                            }}>#사진이 잘나와요</ToggleButton>&nbsp;&nbsp;
                            <ToggleButton id="tbg-btn-5" value={'5'} variant="outline-info" style={{
                                borderRadius: "50px"
                            }}>#조용해요</ToggleButton>&nbsp;&nbsp;
                            <ToggleButton id="tbg-btn-6" value={'6'} variant="outline-success" style={{
                                borderRadius: "50px"
                            }}>#친절해요</ToggleButton>&nbsp;&nbsp;
                            <ToggleButton id="tbg-btn-7" value={'7'} variant="outline-secondary" style={{
                                borderRadius: "50px"
                            }}>#풍경이 좋아요</ToggleButton>&nbsp;&nbsp;
                        </ToggleButtonGroup>
                    </div>
                </div>
                <div className="text-right space-x-2">
                    <button
                        onClick={handleClickModify}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                    >
                        수정
                    </button>
                </div>
            </div>
        </>
    );
};

export default ReviewModifyComponent;