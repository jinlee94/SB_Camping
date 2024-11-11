package com.sbcamping.admin.qna.service;

import com.sbcamping.admin.common.dto.PageRequestDTO;
import com.sbcamping.admin.common.dto.PageResponseDTO;
import com.sbcamping.admin.qna.dto.QnaCommentDTO;
import com.sbcamping.admin.qna.dto.QnaCommentReqDTO;
import com.sbcamping.admin.qna.dto.QnaDTO;
import com.sbcamping.admin.qna.dto.QnaReqDTO;
import com.sbcamping.admin.qna.repository.QnaCommentRepository;
import com.sbcamping.admin.qna.repository.QnaRepository;
import com.sbcamping.domain.Member;
import com.sbcamping.domain.QuestionBoard;
import com.sbcamping.domain.QuestionBoardComment;
import com.sbcamping.user.member.repository.MemberRepository;
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
import org.springframework.web.multipart.MultipartFile;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Log4j2
@RequiredArgsConstructor
@Transactional
public class QnaServiceImpl implements QnaService {

    // 자동 주입 대상은 final로!
    @Autowired
    private final ModelMapper modelMapper;

    @Autowired
    private final QnaRepository qnaRepository;

    @Autowired
    private final QnaCommentRepository qnaCommentRepository;

    private final MemberRepository memberRepository;

    // 1. 목록 (List)
    @Transactional(readOnly = true)
    @Override
    public PageResponseDTO<QnaDTO> getList(PageRequestDTO requestDTO) {
        log.info("getList");

        Pageable pageable = PageRequest.of(requestDTO.getPage() - 1, requestDTO.getSize());
        Page<QuestionBoard> qnas = qnaRepository.orderdList(pageable);

        long totalCount = qnas.getTotalElements();

        List<QnaDTO> dtoList = qnas.getContent().stream().map(qna -> modelMapper.map(qna, QnaDTO.class)).collect(Collectors.toList());

        return PageResponseDTO.<QnaDTO>withAll()
                .dtoList(dtoList)
                .totalCount(totalCount)
                .pageRequestDTO(requestDTO)
                .build();
    }

    // 2. 등록 (Register)
    @Override
    public Long register(QnaReqDTO qnaDTO) {

        Optional<Member> member = memberRepository.findById(qnaDTO.getMemberID());

        if (member.isPresent()) {

            // 관리자가 작성할 경우 공지여부 'Y' 로 변경
            if (member.get().getMemberRole().equals("ROLE_ADMIN")) {
                qnaDTO.setQBoardNotice('Y');
                qnaDTO.setQBoardTitle("[자주하는 질문] " + qnaDTO.getQBoardTitle());
            } else {
                qnaDTO.setQBoardNotice('N');
                qnaDTO.setQBoardTitle(qnaDTO.getQBoardTitle());
            }

            QuestionBoard questionBoard  = QuestionBoard.builder()
                    .qBoardAttachment(qnaDTO.getQBoardAttachment())
                    .qBoardTitle(qnaDTO.getQBoardTitle())
                    .qBoardContent(qnaDTO.getQBoardContent())
                    .member(member.get())
                    .qBoardNotice(qnaDTO.getQBoardNotice())
                    .qBoardViews(0L)
                    .qBoardAsked('N')
                    .qBoardDate(new Date())
                    .build();

          //  QuestionBoard qb = modelMapper.map(qnaDTO, QuestionBoard.class);
            QuestionBoard result = qnaRepository.save(questionBoard);

            return result.getQBoardID();

        }

        return null;
    }

    // 3. 상세 (Read), 조회수 변경
    @Override
    public QnaDTO get(Long qbID) {
        Optional<QuestionBoard> result = qnaRepository.findById(qbID);
        QuestionBoard qb = null;

        if (result.isPresent()) {
            qb = result.orElseThrow();
            qb.changeViews(qb.getQBoardViews() + 1);
            this.qnaRepository.save(qb);
        }

        QnaDTO dto = modelMapper.map(qb, QnaDTO.class);
        return dto;
    }

    // 4. 수정 (Update)
    @Override
    public void modify(QnaReqDTO qnaDTO) {
        // 1. read
        Optional<QuestionBoard> result = qnaRepository.findById(qnaDTO.getQBoardID());
        QuestionBoard qb = result.orElseThrow();

        // 2. change : title, content, file
        String updatedTitle = qnaDTO.getQBoardTitle();
        String updatedContent = qnaDTO.getQBoardContent();
        String updatedAttachment = qnaDTO.getQBoardAttachment();

        if (updatedTitle != null) {
            qb.changeTitle(updatedTitle);
        } else {
            qb.changeTitle(qb.getQBoardTitle());
        }
        if (updatedContent != null) {
            qb.changeContent(updatedContent);
        } else {
            qb.changeContent(qb.getQBoardContent());
        }
        if (updatedAttachment != null) {
            qb.changeAttachment(updatedAttachment);
        } else {
            qb.changeAttachment(qb.getQBoardAttachment());
        }

        qnaRepository.save(qb);
    }

    // 5. 삭제 (Delete)
    @Override
    public void remove(Long qbID) {
        qnaRepository.deleteById(qbID);
    }

    // 6. 검색 (Search) : type (title, content 일부분 검색), keyword가 null인 경우 전체리스트 반환
    @Transactional(readOnly = true)
    @Override
    public PageResponseDTO<QnaDTO> searchQboard(PageRequestDTO requestDTO, String type, String keyword) {
        Pageable pageable = null;
        Page<QuestionBoard> searchQbs = null;

        if (keyword != null) {
            pageable = PageRequest.of(requestDTO.getPage() - 1, requestDTO.getSize(), Sort.by("qBoardID").descending());

            searchQbs = switch (type) {
                case "title" -> qnaRepository.findByqBoardTitleContaining(keyword, pageable);
                case "content" -> qnaRepository.findByqBoardContentContaining(keyword, pageable);
                default -> null;
            };

        } else {
            pageable = PageRequest.of(requestDTO.getPage() - 1, requestDTO.getSize(), Sort.by("qBoardID").descending());
            searchQbs = qnaRepository.orderdList(pageable);
        }

        long totalCount = searchQbs.getTotalElements();

        List<QnaDTO> dtoList = searchQbs.getContent().stream().map(qna -> modelMapper.map(qna, QnaDTO.class)).collect(Collectors.toList());

        return PageResponseDTO.<QnaDTO>withAll()
                .dtoList(dtoList)
                .totalCount(totalCount)
                .pageRequestDTO(requestDTO)
                .build();

    }

    // 7. 댓글 등록 : ROLE에 따라서  -> Question_Board 관리자 답변 상태 컬럼(Qboard_asked)
    @Override
    public Long registerComment(QnaCommentReqDTO qnaCommentDTO, Long qbID) {
        Optional<Member> member = memberRepository.findById(qnaCommentDTO.getMemberID());
        Optional<QuestionBoard> qb = qnaRepository.findById(qbID);

        if (member.isPresent() && qb.isPresent()) {

        // 관리자가 작성할 경우 관리자 답변 여부 'Y' 로 변경, 해당 게시글 관리자 답변 여부 'Y'로 변경
        if (member.get().getMemberRole().equals("ROLE_ADMIN")) {
            qnaCommentDTO.setQBoardIsAdmin('Y');
            qb.get().changeAsked('Y');
            qnaRepository.save(qb.get());   // 이렇게 바로 저장해도 되는건가?!
        } else {
            qnaCommentDTO.setQBoardIsAdmin('N');
        }
            QuestionBoardComment qbcomm = QuestionBoardComment.builder()
                    .qCommentContent(qnaCommentDTO.getQCommentContent())
                    .qCommentDate(new Date()).member(member.get()).qBoard(qb.get())
                    .qBoardIsAdmin(member.get().getMemberRole().equals("ROLE_ADMIN")? 'Y' : 'N').build();

            QuestionBoardComment result = qnaCommentRepository.save(qbcomm);

            return result.getQCommentID();
        }

       return null;
    }

    // 8. 댓글 수정
    @Override
    public void modifyComment(QnaCommentDTO qnaCommentDTO) {
        // 1. read
        Optional<QuestionBoardComment> result = qnaCommentRepository.findById(qnaCommentDTO.getQCommentID());
        QuestionBoardComment qbcomm = result.orElseThrow();
        log.info(qbcomm.getQCommentContent());

        // 2. change : content
        String updatedContent = qnaCommentDTO.getQCommentContent();
        if (updatedContent != null) {
            qbcomm.changeContent(updatedContent);
        }

        // 3. update modified date
        qbcomm.changeDate(new Date()); // 현재 날짜와 시간으로 설정

        // 4. save the updated comment
        qnaCommentRepository.save(qbcomm);
    }

    // 9. 댓글 목록 : 페이징 처리 없음
    @Override
    public List<QnaCommentDTO> commentlist(Long qbID) {
        List<QuestionBoardComment> getList = qnaCommentRepository.orderedList(qbID);
        List<QnaCommentDTO> result = getList.stream().map(qnaComm -> modelMapper.map(qnaComm, QnaCommentDTO.class)).collect(Collectors.toList());
        int count = getList.size();
        log.info(count + " comments found");

        return result;
    }

    // 10. 댓글 삭제
    @Override
    public void removeComment(Long qbcommID, Long qbID) {
        Optional<QuestionBoard> qb = qnaRepository.findById(qbID);
        Optional<QuestionBoardComment> qbcomm = qnaCommentRepository.findById(qbcommID);

        if (qbcomm.isPresent() && qb.isPresent()) {
           if (qbcomm.get().getMember().getMemberRole().equals("ROLE_ADMIN")) {
               qb.get().changeAsked('N');
               qnaRepository.save(qb.get());
           }

         qnaCommentRepository.deleteById(qbcommID);

        }
    }

    // 11. 댓글 정보 가져오기
    @Override
    public QnaCommentDTO getComment(Long qbcommID) {
        Optional<QuestionBoardComment> qbcomm = qnaCommentRepository.findById(qbcommID);
        QuestionBoardComment result = qbcomm.orElseThrow();

        QnaCommentDTO dto = modelMapper.map(result, QnaCommentDTO.class);

        return dto;
    }

}
