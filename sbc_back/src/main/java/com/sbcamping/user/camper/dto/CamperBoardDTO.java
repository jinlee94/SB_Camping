package com.sbcamping.user.camper.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.sbcamping.domain.Member;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Date;

@Data
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CamperBoardDTO {

    private Long cBoardID;
    private Member member; //회원번호 fk

    // 수정가능한 내용
    private String cBoardCategory; //캠퍼 게시글 말머리
    private String cBoardTitle;    //캠퍼 게시판 글 제목
    private String cBoardContent;  //캠퍼 게시판 글 내용
    private Long cBoardViews; //게시글 조회수
    private Date cBoardDate; //캠퍼게시판 게시글 작성일자
    private String cBoardAttachment; //파일 첨부여부(url,링크)
    MultipartFile file;

    //작성자를 list에 표현하기 위한 메소드?
    @JsonProperty("membername")
    public String getMemberName() {
        return member != null ? member.getMemberName() : null; // member가 null이 아닐 경우 memberName 반환
    }
}
