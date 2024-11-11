package com.sbcamping.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Getter
@Table
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class LostItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(updatable = false, columnDefinition = "NUMBER(10,0)")
    private Long itemId;            // 분실물 번호 (자동생성)

    @Column(length = 20)
    private String category;        // 아이템 분류

    @Column(nullable = false)
    private LocalDate regDate;      // 분실물 등록일 (자동생성)

    @Column(nullable = false, length = 20)
    private String foundLocation;   // 습득 장소

    @Column(columnDefinition = "TEXT")
    private String description;     // 추가 설명

    @Column(nullable = false, length = 10)
    private String state = "보관중"; // 보관상태 (보관중/수령완료)

    @Column(nullable = false)
    private String itemImage;       // 이미지 URL


    // 분실물 등록일 자동 입력
    @PrePersist
    protected void onCreate() {if (this.regDate == null) {this.regDate = LocalDate.now();}}

    public void changeCategory(String newCategory) {
        this.category = newCategory;
    }

    public void changeFoundLocation(String newFoundLocation) {
        this.foundLocation = newFoundLocation;
    }

    public void changeState(String newState) {
        this.state = newState;
    }

    public void changeDescription(String newDescription) {
        this.description = newDescription;
    }


}
