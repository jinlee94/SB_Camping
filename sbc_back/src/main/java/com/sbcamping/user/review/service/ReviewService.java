package com.sbcamping.user.review.service;

import com.sbcamping.admin.common.dto.PageRequestDTO;
import com.sbcamping.admin.common.dto.PageResponseDTO;
import com.sbcamping.domain.Reservation;
import com.sbcamping.domain.Review;
import com.sbcamping.user.review.dto.ReviewDTO;
import com.sbcamping.user.review.dto.ReviewReqDTO;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.Optional;

@Transactional
public interface ReviewService {

    // 1. 목록
    PageResponseDTO<ReviewDTO> getList(PageRequestDTO pageRequestDTO); // 목록

    // 2. 검색
    PageResponseDTO<ReviewDTO> searchReview(PageRequestDTO requestDTO, String type, String keyword); // 검색

    // 3. 나의 예약내역 확인
    List<Reservation> reviewCheck(Long memberId);

    // 4. 등록
    Long register(ReviewReqDTO reviewDTO);

    // 5. 상세(read)
    ReviewDTO get(Long reviewID);

    // 6. 삭제(delete)
    void remove(Long reviewID);

    // 7. 수정(update)
    void modify(ReviewReqDTO reviewDTO);

}
