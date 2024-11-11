package com.sbcamping.user.camper.repository;

import com.sbcamping.domain.CamperBoardComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface CamperCommentRepository extends JpaRepository<CamperBoardComment, Long> {

    @Query("select c from CamperBoardComment c where c.cBoard.cBoardID= :boardId order by c.cCommentID ")
    List<CamperBoardComment> getCommentList(Long boardId);

    @Transactional
    @Query("select c from CamperBoardComment c where c.cBoard.cBoardID= :boardId")
    List<CamperBoardComment> deleteBoardCommentList(Long boardId);
}
