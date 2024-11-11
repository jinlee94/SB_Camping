package com.sbcamping.admin.notice.service;

import com.sbcamping.admin.notice.dto.NoticeDTO;
import com.sbcamping.domain.NoticeBoard;

import java.util.List;

public interface NoticeService {

    public List<NoticeDTO> getAllNotices(); //게시글 전체정보 불러오는 메서드 공지목록에서 사용
    public void createNotice(String title,String content);      // 공지 등록
    public NoticeDTO readNotice(Long noticeId);   // 공지 조회
    public void updateNotice(Long noticeId, String title, String content); // 공지 수정
    public void deleteNotice(Long noticeId); // 공지 삭제
    public void increaseViews(Long noticeId);
    public List<NoticeBoard> getLatestThreeNotices(); // 메인페이지 최신글 3개


    //조회수 증가 = 메서드 선언후 다른 메서드에서 활용 할 것
}
