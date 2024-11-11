package com.sbcamping.admin.qna.dto;

import com.sbcamping.domain.Member;
import com.sbcamping.domain.QuestionBoard;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class QnaCommentDTO {
    private Long qCommentID;    // 문의 게시판 댓글 번호

    private Member member; // 외래 키가 참조하는 엔티티 클래스 : 회원 번호(FK)

    private QuestionBoard qBoard;  // 외래 키가 참조하는 엔티티 클래스 : 문의 게시판 글 번호(FK)

    private String qCommentContent; // 댓글 내용

    private Date qCommentDate;  // 댓글 작성일 (시분초까지 나오도록)

    private char qBoardIsAdmin;   // 관리자 댓글 여부
}
