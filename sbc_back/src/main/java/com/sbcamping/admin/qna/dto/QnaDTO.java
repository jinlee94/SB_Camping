package com.sbcamping.admin.qna.dto;

import com.sbcamping.domain.Member;
import jakarta.persistence.*;
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
public class QnaDTO {

    private Long qBoardID;  // 문의게시판 글 번호

    private Member member; // 회원 : 회원 번호(FK)

    private String qBoardTitle; // 문의 게시판 글 제목

    private String qBoardContent;   // 문의 게시판 글 내용

    private String qBoardAttachment;    // 문의 게시판 파일 첨부 일단 1개! ( 업로드 완료된 파일 이름 )

    private Long qBoardViews;   // 문의 게시판 글 조회수

    private Date qBoardDate; // 문의 게시판 글 작성일

    private char qBoardAsked ; // 관리자 답변 상태 ('Y' or 'N')

    private char qBoardNotice;    // 공지 여부 ('Y' or 'N')

    MultipartFile file; // 등록, 수정 시 실제 파일 데이터가 담기는 객체

}
