package com.sbcamping.admin.res.service;

import com.sbcamping.admin.res.dto.ResDTO;
import com.sbcamping.admin.site.dto.SiteDTO;
import com.sbcamping.domain.Reservation;

import java.util.List;

public interface ResService {



    List<ResDTO> getAllRes(); //예약 전체 조회
}
