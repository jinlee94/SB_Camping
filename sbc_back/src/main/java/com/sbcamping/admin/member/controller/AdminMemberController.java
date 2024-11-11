package com.sbcamping.admin.member.controller;

import com.sbcamping.admin.common.dto.PageRequestDTO;
import com.sbcamping.admin.common.dto.PageResponseDTO;
import com.sbcamping.admin.member.dto.AdminMemberDTO;
import com.sbcamping.admin.member.service.AdminMemberService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@Log4j2
@PreAuthorize("hasRole('ROLE_ADMIN')")
@RequestMapping("/admin/member")
public class AdminMemberController {

    @Autowired
    private final AdminMemberService adminMemberService;

    @GetMapping("/totalList")
    public PageResponseDTO<AdminMemberDTO> totallist(PageRequestDTO pageRequestDTO,
                                                     @RequestParam(required = false) String order) {
        log.info("total list..... : "+pageRequestDTO);
         return adminMemberService.fullList(pageRequestDTO, order);  // 기본 정렬 : memberID 오름차순

    }

    @GetMapping("/inactiveList")  // 휴면 회원 리스트
    public PageResponseDTO<AdminMemberDTO> inactiveList(PageRequestDTO pageRequestDTO,
                                                        @RequestParam(required = false) String order) {
        log.info("inactive list...... : "+pageRequestDTO);
        return adminMemberService.inactiveFullList(pageRequestDTO, order);
    }

    @GetMapping("/search")   // 회원 검색
    public PageResponseDTO<AdminMemberDTO> searchMember(PageRequestDTO pageRequestDTO,
                                                        @RequestParam(defaultValue = "name", required = false) String type, @RequestParam(required = false) String keyword,
                                                        @RequestParam(defaultValue = "memberID", required = false) String order) {
        log.info("search result list..... : "+pageRequestDTO);
        return adminMemberService.searchMember(pageRequestDTO, type, keyword, order);  // 기본 정렬 : memberID 오름차순

    }
}
