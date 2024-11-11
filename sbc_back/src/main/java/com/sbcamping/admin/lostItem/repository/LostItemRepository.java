package com.sbcamping.admin.lostItem.repository;

import com.sbcamping.admin.lostItem.dto.LostItemDTO;
import com.sbcamping.domain.LostItem;
import com.sbcamping.domain.QuestionBoard;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface LostItemRepository extends JpaRepository<LostItem, Long> {

    @Query("select l from LostItem l ORDER BY l.itemId desc")
    Page<LostItem> getList(Pageable pageable);

    Page<LostItem> searchByCategoryContainsOrderByRegDate(String keyword, Pageable pageable);
    Page<LostItem> searchByFoundLocationContainsOrderByRegDate(String keyword, Pageable pageable);



}
