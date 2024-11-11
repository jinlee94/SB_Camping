package com.sbcamping.user.camper.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SearchDTO {
    private String keyword; // 검색할 키워드
    private int page; // 페이지 번호
    private int size; // 페이지 크기
}
