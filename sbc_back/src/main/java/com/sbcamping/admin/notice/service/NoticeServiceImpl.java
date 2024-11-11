package com.sbcamping.admin.notice.service;

import com.sbcamping.admin.notice.dto.NoticeDTO;
import com.sbcamping.admin.notice.repository.NoticeRepository;
import com.sbcamping.domain.NoticeBoard;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.modelmapper.ModelMapper;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;


@Service    //서비스 파일임
@Transactional  //트랜잭션처리
@Log4j2
@AllArgsConstructor //생성자 자동생성 
public class NoticeServiceImpl implements NoticeService{

    // NoticeRepository 주입
    private final NoticeRepository noticeRepository;
    //dto변환 도와주는 modelmapper
    private final ModelMapper modelMapper;

    // 메인페이지 최신글 3개
    public List<NoticeBoard> getLatestThreeNotices() {
        return noticeRepository.getThirdList(PageRequest.of(0, 3));
    }

    @Override
    public List<NoticeDTO> getAllNotices() {    //게시글 전체목록을 불러오는 메서드
        log.info("공지글 전체 불러오는 메서드 시작");

        // 모든 notice 엔티티를 가져옵니다.내림차순으로(최근글이 상단위치)
        List<NoticeBoard> notices = noticeRepository.findAll(Sort.by(Sort.Direction.DESC, "nboardId"));

        log.info("공지글 전체 불러오는 메서드 끝 ");
        // ModelMapper를 사용하여 NoticeBoard 엔티티를 NoticeDTO로 변환한 후 리스트로 반환합니다.
        return notices.stream()
                .map(notice -> modelMapper.map(notice, NoticeDTO.class))
                .toList();

    }

    @Override
    public void createNotice(String title,String content) {//게시글 작성 메서드
        log.info("공지 등록 메서드 시작");//디버깅

        //게시글정보를 담은 객체 생성
        NoticeBoard noticeBoard = NoticeBoard.builder()
                .nboardTitle(title)
                .nboardContent(content)
                //현재시간 할당, sysdate랑 비슷한가? =>p.s/변경사항 new Date였는데
                //LocalDateTime.now()로 변경 뉴데이트는 서버시간만 되는데 로컬데이트타임은 아마 시간 조정이 가능 한 듯?
                .nboardDate(LocalDateTime.now())
                .nboardViews(0L)//조회메서드가 실행 될 때마다 View가 1씩 증가하게 해놓으면 될 듯?
                .build();

        //데이터베이스 저장작업은 DB연결,제약조건위반등으로 실패 할 수 있기 때문에 예외처리를 해주는게 좋다고함
        try {
            //노티스 레포지토리를 이용해서 위에서 생성한 데이터를 담고있는 notice엔티티를 데이터베이스에 저장함
            //noticeRepository.save(notice)는 noticeBoard 객체를 데이터베이스에 저장한 후, 저장된 결과를 반환
            noticeRepository.save(noticeBoard);
            log.info("공지 등록 성공");
        } catch (Exception e) {//등록 실패처리

            log.error("공지 등록 실패: {}", e.getMessage());
            throw new RuntimeException("공지 등록 중 오류 발생", e);
        }

        log.info("공지 등록 메서드 끝");//디버깅
    };


    @Override //재정의
    public NoticeDTO readNotice(Long noticeId) { // 공지 조회 메서드
        log.info("공지 조회 메서드 시작");//디버깅

        //orElse를 사용시 null로 반환 될 수도 있어서 orElseThrow를 이용하면 null인경우 예외처리 되기 때문에
        //null인지 검증하는 코드가 들어가지 않아도 괜찮고 그렇기 때문에 옵셔널로 반환받지 않아도 괜찮아서 이렇게 사용한다고 함
        NoticeBoard notice = noticeRepository.findById(noticeId)
                .orElseThrow(() -> new RuntimeException("해당 ID의 공지사항이 존재하지 않습니다."));

        //조회수 증가 메서드
        increaseViews(notice.getNboardId());

        // 엔티티를 DTO로 변환 수동변환했던 과거의 잔재
       /* NoticeDTO noticeDTO = new NoticeDTO();
        noticeDTO.setNboardId(notice.getNboardId());
        noticeDTO.setNboardTitle(notice.getNBoardTitle());
        noticeDTO.setNboardContent(notice.getNBoardContent());
        noticeDTO.setNboardDate(notice.getNBoardDate());
        noticeDTO.setNboardView(notice.getNBoardViews());*/

        //매퍼 라이브러리를 이용해 엔티티를 DTO로 자동변환
        //참조 객체명 = mapper.명령(생성해둔 엔티티인스턴스 객체 ,참조할 클래스 패일)
        NoticeDTO noticeDTO = modelMapper.map(notice, NoticeDTO.class);


        log.info("공지 조회 메서드 끝");

        return noticeDTO;
    }

    @Transactional  //엔티티를 건드리는 작업이라 트랜잭션 처리
    @Override   //service에서 선언한거 재정의
    public void updateNotice(Long noticeId, String title, String content){//공지 수정 메서드
        log.info("공지 수정 메서드 시작");//디버깅
        NoticeBoard notice = noticeRepository.findById(noticeId)
                .orElseThrow(() -> new RuntimeException("해당 ID의 공지사항이 존재하지 않습니다."));

        //뷰단에서 기존 제목과 타이틀이 기본값
        notice.changeNBoardTitle(title);
        notice.changeNBoardContent(content);


        log.info("공지 수정 메서드 끝");//디버깅
    }
    
    @Override   //재정의
    public void deleteNotice(Long noticeId) {//pk를 이용해 DB에서 게시글을 지우는 메서드
        log.info("공지 삭제 메서드 시작");

        try {//정상적 처리
            noticeRepository.deleteById(noticeId);
            log.info("공지 삭제 성공");
        } catch (EmptyResultDataAccessException e) {//예외처리
            log.error("삭제 실패: 해당 ID의 공지사항이 존재하지 않습니다.");
            throw new RuntimeException("공지 삭제 중 오류 발생: 해당 ID의 공지사항이 존재하지 않습니다.", e);
        }
        log.info("공지 삭제 메서드 끝");
    }

    //조회수 증가 메서드
    @Override
    public void increaseViews(Long noticeId) {
        // 공지사항을 조회하고 없으면 예외를 던짐
        NoticeBoard notice = noticeRepository.findById(noticeId)
                .orElseThrow();

        // 조회수 증가
        notice.setNboardViews(notice.getNboardViews() + 1);

        log.info("조회수 증가 메서드 실행완료 ");
    }

}
