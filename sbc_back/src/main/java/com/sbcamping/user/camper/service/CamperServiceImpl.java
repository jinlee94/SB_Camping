package com.sbcamping.user.camper.service;

import com.sbcamping.common.jwt.JWTUtil;
import com.sbcamping.domain.CamperBoard;
import com.sbcamping.domain.CamperBoardComment;
import com.sbcamping.domain.Member;
import com.sbcamping.user.camper.dto.*;
import com.sbcamping.user.camper.repository.CamperCommentRepository;
import com.sbcamping.user.camper.repository.CamperRepository;
import com.sbcamping.user.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class CamperServiceImpl implements CamperService {

    private final ModelMapper modelMapper;

    private final CamperRepository camperRepository;

    private final CamperCommentRepository commentRepository;

    private final MemberRepository memberRepository;

    private final String TITLE = "title";
    private final String CONTENT = "content";
    @Autowired
    private CamperCommentRepository camperCommentRepository;

    @Override
    public Long register(CamperBoardDTO camperBoardDTO) {
        CamperBoard camperBoard = modelMapper.map(camperBoardDTO, CamperBoard.class);
        log.info(camperBoard.toString());
        CamperBoard savedCamperBoard = camperRepository.save(camperBoard);

        return savedCamperBoard.getCBoardID();
    }
    //read
//    @Override
//    public CamperBoard get(Long cBoardId) {
//        CamperBoard camperBoard = camperRepository.findById(cBoardId)
//                .orElseThrow(() -> new NoResultsFoundException("해당 캠퍼 보드를 찾을 수 없습니다."));
//
//        camperBoard.changeViews(camperBoard.getCBoardViews() + 1);
//
//        camperRepository.save(camperBoard);
//
//        return camperBoard;
//    }
    @Override
    public CamperBoardDTO get(Long cBoardID) {
        Optional<CamperBoard> camperBoard = camperRepository.findById(cBoardID);
        CamperBoard cb = null;

        if (camperBoard.isPresent()) {
            cb = camperBoard.orElseThrow();
            cb.changeViews(cb.getCBoardViews() + 1);
            this.camperRepository.save(cb);
        }

        CamperBoardDTO dto = modelMapper.map(cb, CamperBoardDTO.class);
        return dto;
    }

    @Override
    public void modify(CamperBoardReqDTO camperBoardDTO) {

        Optional<CamperBoard> result = camperRepository.findById(camperBoardDTO.getCBoardId());

        CamperBoard camperBoard = result.orElseThrow(null);

        if (camperBoardDTO.getCBoardCategory() != null) {
            camperBoard.changeCategory(camperBoardDTO.getCBoardCategory());
        }

        if (camperBoardDTO.getCBoardTitle() != null) {
            camperBoard.changeTitle(camperBoardDTO.getCBoardTitle());
        }

        if (camperBoardDTO.getCBoardContent() != null) {
            camperBoard.changeContent(camperBoardDTO.getCBoardContent());
        }

        if (camperBoardDTO.getCBoardAttachment() != null) {
            camperBoard.changeAttachment(camperBoardDTO.getCBoardAttachment());
        } else {
            camperBoard.changeAttachment(camperBoard.getCBoardAttachment());
        }
        camperRepository.save(camperBoard);
    }


    @Override
    public void remove(Long cBoardId) {
        List<CamperBoardComment> deleteBoardCommentList = camperCommentRepository.deleteBoardCommentList(cBoardId);
        deleteBoardCommentList.forEach(
                c -> camperCommentRepository.deleteById(c.getCCommentID())
        );

        camperRepository.deleteById(cBoardId);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponseDTO<CamperBoardDTO> list(PageRequestDTO pageRequestDTO) {
        Pageable pageable = PageRequest.of(
                pageRequestDTO.getPage() - 1, //1페이지가 0이므로 주의
                pageRequestDTO.getSize(), Sort.by("cBoardID").descending());

        Page<CamperBoard> result = camperRepository.findAll(pageable);

        List<CamperBoardDTO> dtoList = result.getContent().stream().map(camperBoard ->
                modelMapper.map(camperBoard, CamperBoardDTO.class)).collect(Collectors.toList());

        long totalCount = result.getTotalElements();

        PageResponseDTO<CamperBoardDTO> responseDTO = PageResponseDTO.<CamperBoardDTO>withAll()
                .dtoList(dtoList).pageRequestDTO(pageRequestDTO).totalCount(totalCount).build();

        return responseDTO;
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponseDTO<CamperBoardDTO> search(
            PageRequestDTO requestDTO, String type, String keyword
    ) {
        Pageable pageable;
        Page<CamperBoard> res;

        if (keyword != null) {
            pageable = PageRequest.of(
                    requestDTO.getPage() - 1,
                    requestDTO.getSize(), Sort.by("cBoardID").descending());

            res = switch (type) {
                case TITLE -> camperRepository.findAllBycBoardTitleContaining(keyword, pageable);
                case CONTENT -> camperRepository.findAllBycBoardContentContaining(keyword, pageable);
                default -> null;
            };

        } else {
            pageable = PageRequest.of(
                    requestDTO.getPage() - 1,
                    requestDTO.getSize(),
                    Sort.by("cBoardID").descending()
            );
            res = camperRepository.orderdList(pageable);
        }

        long totalCount = res.getTotalElements();

        List<CamperBoardDTO> dtoList = res.getContent().stream().map(qna -> modelMapper.map(qna, CamperBoardDTO.class)).collect(Collectors.toList());

        return PageResponseDTO.<CamperBoardDTO>withAll()
                .dtoList(dtoList)
                .totalCount(totalCount)
                .pageRequestDTO(requestDTO)
                .build();
    }
    //댓글 리스트
    @Override
    public List<CamperBoardCommentReqDTO> getCommentList(Long boardId) {
        List<CamperBoardComment> getList = commentRepository.getCommentList(boardId);
        List<CamperBoardCommentReqDTO> result = getList.stream()
                .map(c -> modelMapper.map(c, CamperBoardCommentReqDTO.class))
                .collect(Collectors.toList());
        return result;
    }
    //댓글 등록
    @Override
    public Long registerComment(
            String auth,
            String refreshToken,
            CamperBoardCommentDTO dto
    ) {
        Member member = this.getMemberInfo(auth, refreshToken);
        String memberRole = member.getMemberRole();

        Optional<CamperBoard> camperBoardOpt = camperRepository.findById(dto.getBoardId());
        if (camperBoardOpt.isPresent()) {
            CamperBoard camperBoard = camperBoardOpt.get();


            return commentRepository.save(
                    CamperBoardComment.builder()
                            .member(member)
                            .cBoard(camperBoard)
                            .cCommentContent(dto.getCCommentContent())
                            .cCommentDate(new Date())
                            .build()
            ).getCCommentID();
        } else {
            return 0L;
        }
    }
    //댓글 수정
    @Override
    public void modifyComment(CamperBoardCommentDTO dto) {
        //read
        Optional<CamperBoardComment> result = commentRepository.findById(dto.getCommentId());
        CamperBoardComment camperBoardComment = result.orElseThrow();
        log.info(camperBoardComment.getCCommentContent());
        //change:content
        String updatedContent = dto.getCCommentContent();
        if (updatedContent != null) {
            camperBoardComment.changeContent(updatedContent);
        }
        //update modified date
        camperBoardComment.changeDate(new Date());


        commentRepository.save(camperBoardComment);
    }
    //댓글 삭제
    @Override
    public void removeComment(Long commentId, Long cBoardId)
    {
        Optional<CamperBoard> cboard = camperRepository.findById(cBoardId);
        Optional<CamperBoardComment> cboardComment = commentRepository.findById(commentId);

        commentRepository.deleteById(commentId);
    }

    @Override
    public CamperBoardCommentDTO getComment(Long commentId) {
        Optional<CamperBoardComment> camperComment = camperCommentRepository.findById(commentId);
        CamperBoardComment result = camperComment.orElseThrow();

        CamperBoardCommentDTO dto = modelMapper.map(result, CamperBoardCommentDTO.class);

        return dto;
    }

    private Member getMemberInfo(String auth, String refreshToken) {
        String accessToken = auth.substring(7);
        Map<String, Object> claims = JWTUtil.validateToken(refreshToken);
        Map<String, Object> memberClaims = (Map<String, Object>) claims.get("member");
        String memberEmail = (String) memberClaims.get("memberEmail");
        return memberRepository.findByMemberEmail(memberEmail).get();
    }

    @Override
    public boolean isBoardAuth(String auth, String refreshToken, Long boardId) {
        Member member = this.getMemberInfo(auth, refreshToken);
        CamperBoard camperBoard = camperRepository.findById(boardId).orElseThrow();

        log.info("member id : {}", member.getMemberID());
        log.info("board member id : {}", camperBoard.getMember().getMemberID());

        return camperBoard.getMember().getMemberID() == member.getMemberID();
    }

    @Override
    public boolean isCommentAuth(String auth, String refreshToken, Long commentId) {
        Member member = this.getMemberInfo(auth, refreshToken);
        CamperBoardComment comment = camperCommentRepository.findById(commentId).orElseThrow();

        log.info("member id : {}", member.getMemberID());
        log.info("comment member id : {}", comment.getMember().getMemberID());

        return comment.getMember().getMemberID() == member.getMemberID();
    }

}





