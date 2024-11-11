package com.sbcamping.admin.notice.repository;

import com.sbcamping.domain.NoticeBoard;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NoticeRepository extends JpaRepository<NoticeBoard,Long> {

    // 메인페이지 공지사항 최신글 3개
    @Query("SELECT n FROM NoticeBoard n ORDER BY n.nboardId DESC")
    List<NoticeBoard> getThirdList(Pageable pageable);


}
