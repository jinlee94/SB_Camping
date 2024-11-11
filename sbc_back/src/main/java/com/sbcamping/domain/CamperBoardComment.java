package com.sbcamping.domain;

import jakarta.persistence.*;
import lombok.*;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.Date;


@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@ToString
@Table(name="Camper_Board_Comment")
public class CamperBoardComment {   // 캠퍼 게시판 댓글

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)//프라이머리키 자동설정
    @Column(name ="Cboard_Comment_ID", columnDefinition = "NUMBER(10,0)")
    private Long cCommentID;    // 캠퍼 게시판 댓글 번호

    @ManyToOne
    // Member테이블을 참조하는 회원 번호(FK) ,이 경우엔 필드명이 같지만 테이블마다 컬럼명이 다를 수도 있으니 지정해줘야함
    @JoinColumn(name="MEMBER_ID", referencedColumnName = "Member_ID")
    private Member member; // 외래 키가 참조하는 엔티티 클래스

    @ManyToOne
    @JoinColumn(name="Cboard_ID", referencedColumnName = "Cboard_ID")
    private CamperBoard cBoard;  // 캠퍼 게시판 글 번호

    @Column(name = "Cboard_Comment_content",nullable = false,length = 200)
    private String cCommentContent; // 댓글 내용

    @Column(name = "Cboard_Comment_Date",nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date cCommentDate;  // 댓글 작성일

    public void changeContent(String content) {
        this.cCommentContent = content;
    }
    public void changeDate(Date date) {
        this.cCommentDate = date;
    }
}
