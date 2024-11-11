package com.sbcamping.user.camper.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CamperBoardCommentDTO {
    private Long boardId;
    private Long commentId;

    @JsonProperty("cCommentContent")
    private String cCommentContent;

    private Date cCommentDate;
}
