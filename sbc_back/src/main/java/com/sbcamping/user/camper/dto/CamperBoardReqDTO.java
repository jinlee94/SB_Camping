package com.sbcamping.user.camper.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CamperBoardReqDTO {
    private String cBoardCategory;
    private String cBoardTitle;
    private String cBoardContent;
    private String cBoardAttachment;

    private Long cBoardId;

    MultipartFile file;

    private Long memberId;
}
