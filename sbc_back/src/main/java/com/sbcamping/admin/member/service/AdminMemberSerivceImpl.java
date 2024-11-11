package com.sbcamping.admin.member.service;

import com.sbcamping.admin.common.dto.PageRequestDTO;
import com.sbcamping.admin.common.dto.PageResponseDTO;
import com.sbcamping.admin.member.dto.AdminMemberDTO;
import com.sbcamping.admin.member.repository.AdminMemberRepository;
import com.sbcamping.domain.Member;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Log4j2
public class AdminMemberSerivceImpl implements AdminMemberService {

    // 자동 주입 대상은 final로!
    @Autowired
    private final ModelMapper modelMapper;

    @Autowired
    private final AdminMemberRepository adminMemberRepository;

    @Transactional(readOnly = true)
    @Override
    public PageResponseDTO<AdminMemberDTO> fullList(PageRequestDTO requestDTO, String order) {
        Pageable pageable = null;

        if (order == null) {
            pageable = PageRequest.of(requestDTO.getPage()-1, requestDTO.getSize(), Sort.by("memberID").ascending());
        } else {
            if (String.valueOf(order.charAt(0)).equals("-")) {
                pageable = PageRequest.of(requestDTO.getPage()-1, requestDTO.getSize(), Sort.by(order.substring(1)).descending());
            } else {
                pageable = PageRequest.of(requestDTO.getPage()-1, requestDTO.getSize(), Sort.by(order).ascending());
            }
        }

        Page<Member> members = adminMemberRepository.findAll(pageable);

        long totalCount = members.getTotalElements();

        List<AdminMemberDTO> dtoList = members.getContent().stream().map(member -> modelMapper.map(member, AdminMemberDTO.class)).collect(Collectors.toList());

        return PageResponseDTO.<AdminMemberDTO>withAll()
                .dtoList(dtoList)
                .totalCount(totalCount)
                .pageRequestDTO(requestDTO)
                .build();
    }

    @Transactional(readOnly = true)
    @Override
    public PageResponseDTO<AdminMemberDTO> inactiveFullList(PageRequestDTO requestDTO, String order) {
        Pageable pageable = null;

        if (order == null) {
            pageable = PageRequest.of(requestDTO.getPage()-1, requestDTO.getSize(), Sort.by("memberID").ascending());
        } else {
            if (String.valueOf(order.charAt(0)).equals("-")) {
                pageable = PageRequest.of(requestDTO.getPage()-1, requestDTO.getSize(), Sort.by(order.substring(1)).descending());
            } else {
                pageable = PageRequest.of(requestDTO.getPage()-1, requestDTO.getSize(), Sort.by(order).ascending());
            }
        }

        Page<Member> members = adminMemberRepository.selectInactive(pageable);

        long totalCount = members.getTotalElements();

        List<AdminMemberDTO> dtoList = members.getContent().stream().map(member -> modelMapper.map(member, AdminMemberDTO.class)).collect(Collectors.toList());

        return PageResponseDTO.<AdminMemberDTO>withAll()
                .dtoList(dtoList)
                .totalCount(totalCount)
                .pageRequestDTO(requestDTO)
                .build();
    }

    @Transactional(readOnly = true)
    @Override
    public PageResponseDTO<AdminMemberDTO> searchMember(PageRequestDTO requestDTO, String type, String keyword, String order) {
        Pageable pageable = null;
        Page<Member> searchMembers = null;

        if (keyword != null) {
            if (String.valueOf(order.charAt(0)).equals("-")) {
                pageable = PageRequest.of(requestDTO.getPage()-1, requestDTO.getSize(), Sort.by(order.substring(1)).descending());
            } else {
                pageable = PageRequest.of(requestDTO.getPage()-1, requestDTO.getSize(), Sort.by(order).ascending());
            }

            searchMembers = switch (type) {
                case "name" -> adminMemberRepository.findByMemberNameContaining(keyword, pageable);
                case "phone" -> adminMemberRepository.findByMemberPhoneEndingWith(keyword, pageable);
                case "email" -> adminMemberRepository.findByMemberEmailContaining(keyword, pageable);
                default -> null;
            };

        } else {
            pageable = PageRequest.of(requestDTO.getPage()-1, requestDTO.getSize(), Sort.by("memberID").ascending());
            searchMembers = adminMemberRepository.findAll(pageable);
        }

        long totalCount = searchMembers.getTotalElements();

        List<AdminMemberDTO> dtoList = searchMembers.getContent().stream().map(member -> modelMapper.map(member, AdminMemberDTO.class)).collect(Collectors.toList());

        return PageResponseDTO.<AdminMemberDTO>withAll()
                .dtoList(dtoList)
                .totalCount(totalCount)
                .pageRequestDTO(requestDTO)
                .build();

    }
}
