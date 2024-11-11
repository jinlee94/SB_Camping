package com.sbcamping.user.camper.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.sbcamping.domain.CamperBoard;
import com.sbcamping.domain.Member;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CamperBoardCommentReqDTO {
    @JsonProperty("boardId")
    private Long boardId;

    @JsonProperty("cCommentID")
    private Long cCommentID;

    @JsonProperty("cCommentContent")
    private String cCommentContent;

    private Member member;
    private CamperBoard cBoard;

    @JsonProperty("cCommentDate")
    private Date cCommentDate;

}
