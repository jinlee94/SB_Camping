package com.sbcamping.admin.lostItem.service;

import com.sbcamping.admin.common.dto.PageRequestDTO;
import com.sbcamping.admin.common.dto.PageResponseDTO;
import com.sbcamping.admin.lostItem.dto.LostItemDTO;
import com.sbcamping.admin.qna.dto.QnaDTO;
import com.sbcamping.domain.LostItem;
import com.sbcamping.user.review.dto.ReviewDTO;

public interface LostItemService {
    // 분실물 등록
    Long addItem(LostItemDTO lostItemDTO);
    // 분실물 수정
    Long updateItem(Long itemId, LostItemDTO lostItemDTO);
    // 분실물 전체 목록
    PageResponseDTO<LostItem> getList(PageRequestDTO requestDTO);
    // 분실물 카테고리로 검색
    PageResponseDTO<LostItem> search(PageRequestDTO requestDTO, String type, String keyword);
    // 분실물 삭제
    void deleteItem(Long itemId);

}
