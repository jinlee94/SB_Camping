package com.sbcamping.admin.qna.repository;

import com.sbcamping.admin.qna.dto.QnaDTO;
import com.sbcamping.domain.Member;
import com.sbcamping.domain.QuestionBoard;
import com.sbcamping.domain.QuestionBoardComment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface QnaRepository extends JpaRepository<QuestionBoard, Long> {

    // 정렬기준 : QboardId 내림차순 & 관리자가 작성한 글("자주하는 질문")이 제일 상단에 위치
    @Query("select qb from QuestionBoard qb order by case when qb.qBoardNotice ='Y' then 0 else 1 end, qb.qBoardID desc")
    Page<QuestionBoard> orderdList(Pageable pageable);

    // 게시글 검색 (1) 제목
    Page<QuestionBoard> findByqBoardTitleContaining(String title, Pageable pageable);

    // 게시글 검색 (2) 내용
    Page<QuestionBoard> findByqBoardContentContaining(String content, Pageable pageable);

}
