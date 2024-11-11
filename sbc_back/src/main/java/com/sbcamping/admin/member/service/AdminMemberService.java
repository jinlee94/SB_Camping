package com.sbcamping.admin.member.service;

import com.sbcamping.admin.common.dto.PageRequestDTO;
import com.sbcamping.admin.common.dto.PageResponseDTO;
import com.sbcamping.admin.member.dto.AdminMemberDTO;
import org.springframework.transaction.annotation.Transactional;

@Transactional
public interface AdminMemberService {

    // 회원 전체 리스트 : (기본값) memberID 내림차순 (정렬) (기본 오름차순) 회원명, 가입일 / (내림차순) -회원명, -가입일
    PageResponseDTO<AdminMemberDTO> fullList(PageRequestDTO requestDTO, String order);

    // 휴면 회원 리스트 : (기본값) memberID 내림차순 (정렬) (기본 오름차순) 회원명, 가입일 / (내림차순) -회원명, -가입일
    PageResponseDTO<AdminMemberDTO> inactiveFullList(PageRequestDTO requestDTO, String order);

    // 회원 검색 : type (name, phone(뒷자리), email 일부분 검색), keyword가 null인 경우 전체리스트 반환
    PageResponseDTO<AdminMemberDTO> searchMember(PageRequestDTO requestDTO, String type, String keyword, String order);


}
