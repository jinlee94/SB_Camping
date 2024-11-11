package com.sbcamping.admin.qna.dto;

import com.sbcamping.domain.Member;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.util.Date;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class QnaReqDTO {
    private String qBoardTitle; // 문의 게시판 글 제목
    private String qBoardContent;   // 문의 게시판 글 내용
    private String qBoardAttachment;
    private char qBoardNotice;

    private Long qBoardID;

    MultipartFile file; // 등록, 수정 시 실제 파일 데이터가 담기는 객체

    private Long memberID; // 회원 : 회원 번호(FK)
}
