package com.sbcamping.domain;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Entity
@Table(name = "Question_Board_Comment")
@Getter
@ToString
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class QuestionBoardComment { // 문의게시판 댓글

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Qboard_Comment_ID", columnDefinition = "NUMBER(10,0)")
    private Long qCommentID;    // 문의 게시판 댓글 번호

    @ManyToOne
    @JoinColumn(name="MEMBER_ID", referencedColumnName = "Member_ID") // 회원 번호(FK)
    private Member member; // 외래 키가 참조하는 엔티티 클래스

    @ManyToOne
    @JoinColumn(name="qboard_id", referencedColumnName = "qboard_id") // 문의 게시판 글 번호(FK)
    private QuestionBoard qBoard;  // 외래 키가 참조하는 엔티티 클래스

    @Column(name="Qboard_Comment_Content", length = 200, nullable = false)
    private String qCommentContent; // 댓글 내용

    @Column(name = "QBoard_Comment_Date", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date qCommentDate;  // 댓글 작성일

    @Column(nullable = false)
    private char qBoardIsAdmin = 'N';   // 관리자 댓글 여부

    // 댓글 수정 시 수정 가능한 항목
    public void changeContent(String content) {
        this.qCommentContent = content;
    }

    public void changeDate(Date date) {
        this.qCommentDate = date;
    }
}
