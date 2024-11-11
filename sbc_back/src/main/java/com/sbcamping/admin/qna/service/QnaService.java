package com.sbcamping.admin.qna.service;

import com.sbcamping.admin.common.dto.PageRequestDTO;
import com.sbcamping.admin.common.dto.PageResponseDTO;
import com.sbcamping.admin.qna.dto.QnaCommentDTO;
import com.sbcamping.admin.qna.dto.QnaCommentReqDTO;
import com.sbcamping.admin.qna.dto.QnaDTO;
import com.sbcamping.admin.qna.dto.QnaReqDTO;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional
public interface QnaService {

    // 1. 목록 (List)
    PageResponseDTO<QnaDTO> getList(PageRequestDTO requestDTO);

    // 2. 등록 (Register)
    Long register(QnaReqDTO qnaDTO);

    // 3. 상세 (Read), 조회수
    QnaDTO get(Long qbID);

    // 4. 수정 (Update)
    void modify(QnaReqDTO qnaDTO);

    // 5. 삭제 (Remove)
    void remove(Long qbID);

    // 6. 검색 (Search) : type (title, content 일부분 검색), keyword가 null인 경우 전체리스트 반환
    PageResponseDTO<QnaDTO> searchQboard(PageRequestDTO requestDTO, String type, String keyword);

    // 7. 댓글 등록 : ROLE에 따라서  -> Question_Board 관리자 답변 상태 컬럼(Qboard_asked)
    public Long registerComment(QnaCommentReqDTO qnaCommentDTO, Long qbID);

    // 8. 댓글 수정
    void modifyComment(QnaCommentDTO qnaCommentDTO);

    // 9. 댓글 목록 : 페이징 처리 없음, 해당 글의 댓글 목록만 읽어오기
    List<QnaCommentDTO> commentlist(Long qbID);

    // 10. 댓글 삭제
    void removeComment(Long qbcommID, Long qbID);

    // 11. 댓글 정보 가져오기
    QnaCommentDTO getComment(Long qbcommID);
}
