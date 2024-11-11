package com.sbcamping.admin.site.service;

import com.sbcamping.admin.site.dto.SiteDTO;

import java.util.List;

public interface SiteService {
    //사이트 정보 전체를 불러오는 메서드
    List<SiteDTO> getAllSites();
    //pk를 매개변수로 받아서 구역정보를 변경하는 메서드
    void updateSite(Long id, SiteDTO siteDTO);

}
