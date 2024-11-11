package com.sbcamping.domain;

import jakarta.persistence.*;
import lombok.*;

import java.text.SimpleDateFormat;
import java.util.Date;

@Entity
@Table(name = "Question_Board")
@Getter
@ToString
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class QuestionBoard { // 문의게시판

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Qboard_ID", columnDefinition = "NUMBER(10,0)")
    private Long qBoardID;  // 문의게시판 글 번호

    @ManyToOne
    @JoinColumn(name = "MEMBER_ID", referencedColumnName = "Member_ID") // 회원 번호(FK)
    private Member member; // 외래 키가 참조하는 엔티티 클래스

    @Column(name = "QBoard_Title", length = 50, nullable = false)
    private String qBoardTitle; // 문의 게시판 글 제목

    @Column(name = "QBoard_Content", length = 1000, nullable = false)
    private String qBoardContent;   // 문의 게시판 글 내용

    @Column(name = "QBoard_Attachment", length = 200)
    private String qBoardAttachment;    // 문의 게시판 파일 첨부

    @Column(name = "Qboard_Views", columnDefinition = "NUMBER(30,0)", nullable = false)
    private Long qBoardViews = 0L;   // 문의 게시판 글 조회수

    @Column(name = "QBoard_Date", nullable = false)
    @Temporal(TemporalType.DATE)
    private Date qBoardDate; // 문의 게시판 글 작성일 (기본값 설정)

    @Column(name = "QBoard_asked", length = 1, nullable = false)
    private char qBoardAsked = 'N'; // 관리자 답변 상태 (기본값 설정)

    @Column(name = "QBoard_notice", length = 1, nullable = false)
    private char qBoardNotice = 'N';    // 공지 여부 (기본값 설정)

    // 글 수정 시, 수정 가능한 항목
    public void changeTitle(String title) {
        this.qBoardTitle = title;
    }

    public void changeContent(String content) {
        this.qBoardContent = content;
    }

    public void changeAttachment(String attachment) {
        this.qBoardAttachment = attachment;
    }

    // 관리자가 문의글에 댓글 작성 시, 관리자 답변 상태 변경
    public void changeAsked(char asked) {
        this.qBoardAsked = asked;
    }

    // 조회수
    public void changeViews(long views) {
        this.qBoardViews = views;
    }

}
