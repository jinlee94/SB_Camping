package com.sbcamping.user.review.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ReviewReqDTO {
    private String reviewTitle;
    private String reviewContent;
    private String reviewAttachment;

    private Long reviewID;

    MultipartFile file; // 등록, 수정 시 실제 파일 데이터가 담기는 객체

    private Long memberId;
    private String resId;

    private char rtag_Clean; // 청결 태그

    private char rtag_Price; // 가성비 태그

    private char rtag_Facility; // 시설 태그

    private char rtag_Photo; // 사진 태그

    private char rtag_Silence; // 조용 태그

    private char rtag_Kind; // 친절 태그

    private char rtag_View; // 풍경 태그
}
