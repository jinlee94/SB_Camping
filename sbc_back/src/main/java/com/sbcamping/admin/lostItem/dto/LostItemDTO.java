package com.sbcamping.admin.lostItem.dto;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor

public class LostItemDTO {

    private Long itemId;            // 분실물 번호 (자동생성)

    private String category;        // 아이템 분류

    private LocalDate regDate;      // 분실물 등록일

    private String foundLocation;   // 습득 장소

    private String description;     // 추가 설명

    private String state;           // 보관상태 (보관중/수령완료)

    private String itemImage;       // 이미지 URL

    MultipartFile file;             // 파일 처리 객체

}
