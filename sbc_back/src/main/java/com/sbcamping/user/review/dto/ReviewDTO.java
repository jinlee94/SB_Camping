package com.sbcamping.user.review.dto;

import com.sbcamping.domain.Member;
import com.sbcamping.domain.Reservation;
import com.sbcamping.user.reservation.dto.MemberDTO;
import com.sbcamping.user.reservation.dto.ReservationDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ReviewDTO {

    private Long reviewID; // 리뷰 번호

    private Member member; // 멤버

    private Reservation review; // 예약

    private String reviewTitle; // 리뷰 제목

    private String reviewContent; // 리뷰 내용

    private String reviewDate; // 리뷰 작성일

    private String reviewAttachment; // 파일 첨부

    private char rtag_Clean; // 청결 태그

    private char rtag_Price; // 가성비 태그

    private char rtag_Facility; // 시설 태그

    private char rtag_Photo; // 사진 태그

    private char rtag_Silence; // 조용 태그

    private char rtag_Kind; // 친절 태그

    private char rtag_View; // 풍경 태그

    MultipartFile file; // 등록, 수정 시 실제 파일 데이터가 담기는 객체
}
