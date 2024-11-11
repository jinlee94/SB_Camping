package com.sbcamping.user.camper.service;


import com.sbcamping.user.camper.dto.*;

import java.util.List;


public interface CamperService {

    Long register(CamperBoardDTO camperBoardDTO);

    CamperBoardDTO get(Long cBoardId);

    void modify(CamperBoardReqDTO camperBoardDTO);

    void remove(Long cBoardId);


    PageResponseDTO<CamperBoardDTO> list(PageRequestDTO pageRequestDTO);

    PageResponseDTO<CamperBoardDTO> search(
            PageRequestDTO requestDTO, String type, String keyword
    );

    List<CamperBoardCommentReqDTO> getCommentList(Long boardId);

    Long registerComment(String auth, String refreshToken, CamperBoardCommentDTO dto);

    void modifyComment(CamperBoardCommentDTO dto);

    void removeComment(Long cCommentId, Long cBoardId);

    CamperBoardCommentDTO getComment(Long commentId);

    boolean isBoardAuth(String auth, String refreshToken, Long boardId);

    boolean isCommentAuth(String auth, String refreshToken, Long commentId);
}
