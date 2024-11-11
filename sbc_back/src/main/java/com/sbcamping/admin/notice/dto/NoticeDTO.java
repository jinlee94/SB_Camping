package com.sbcamping.admin.notice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data //Getter,Setter,equals,hashCode,toString자동 생성
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class NoticeDTO {

    private Long nboardId;  //공지글 번호
    private String nboardTitle; //공지글 제목
    private String nboardContent;   //공지글 내용
    private LocalDateTime nboardDate;    //공지글 작성일자
    private Long nboardViews;    //공지글 조회수
}
