package com.sbcamping.admin.qna.dto;

import com.sbcamping.domain.Member;
import com.sbcamping.domain.QuestionBoard;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class QnaCommentReqDTO {

    private Long memberID; // 회원 : 회원 번호(FK)

    private Long qBoardID;

    private String qCommentContent; // 댓글 내용

    private Date qCommentDate;  // 댓글 작성일 (시분초까지 나오도록)

    private char qBoardIsAdmin;   // 관리자 댓글 여부
}
