package com.sbcamping.user.camper.repository;

import com.sbcamping.domain.CamperBoard;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;


public interface CamperRepository extends JpaRepository<CamperBoard, Long> {

    @Query("select c from CamperBoard c order by c.cBoardID desc")
    Page<CamperBoard> orderdList(Pageable pageable);

    Page<CamperBoard> findAllBycBoardTitleContaining(String title, Pageable pageable);

    Page<CamperBoard> findAllBycBoardContentContaining(String content, Pageable pageable);

}
