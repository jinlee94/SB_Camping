package com.sbcamping.admin.site.service;

import com.sbcamping.admin.site.dto.SiteDTO;
import com.sbcamping.admin.site.repository.AdminSiteRepository;
import com.sbcamping.domain.Site;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;

@Service
@Transactional
@Log4j2
@RequiredArgsConstructor // 생성자 자동주입
public class SiteServiceImpl implements SiteService{

    //자동주입 대상은 final로 설정해야함
    //왜?
    //=>안정성과 불변성을 위해서 관행적으로
    //final로 설정시 해당 필드가 변경되지 않음을 명확하게 알 수 있기 때문에 코드의 가독성이 높아지고 유지보수에 용이해진다고 한다
    //다른 개발자들이 보면 단순히 주입받아서 사용한다는것을 한 눈에  봐도 알 수 있기 때문인 것 같음
    private final AdminSiteRepository adminSiteRepository;    //레포지토리 인스턴스
    private final ModelMapper modelMapper;  //매퍼 인스턴스

    @Override   //서비스선언 impl재정의
    public List<SiteDTO> getAllSites() {    //
        log.info("구역전체 불러오는 메서드 시작");
        // 모든 Site 엔티티를 가져옵니다.
        List<Site> sites = adminSiteRepository.findAll(Sort.by(Sort.Direction.ASC, "siteId"));

        log.info("구역전체 불러오는 메서드 끝 ");
        // ModelMapper를 사용하여 Site 엔티티를 SiteDTO로 변환한 후 리스트로 반환합니다.
        return sites.stream()
                .map(site -> modelMapper.map(site, SiteDTO.class))
                .toList();

    }

    @Override
    public void updateSite(Long siteId, SiteDTO siteDTO) {  //구역정보 수정 메서드
        log.info("구역정보 수정 메서드 시작");
        Site site = adminSiteRepository.findById(siteId)//구역번호를 매개변수로 사이트 레포지토리에서 정보를 받아와서 site에 할당
                .orElseThrow(() -> new RuntimeException("해당 ID의 사이트가 존재하지 않습니다."));

        // Site 엔티티의 change 메서드 사용하여 필드 업데이트
        site.changeSiteName(siteDTO.getSiteName());
        site.changeResLimit(siteDTO.getSiteResLimit().charAt(0)); // String -> char 변환
        site.changeWeekendPay((long) siteDTO.getWeekendPay());
        site.changeWeekdayPay((long) siteDTO.getWeekdayPay());
        site.changeMinPeople((long) siteDTO.getMinPeople());
        site.changeMaxPeople((long) siteDTO.getMaxPeople());

        // 변경된 엔티티 저장
        adminSiteRepository.save(site);
        log.info("구역정보 수정 메서드 끝");
    }

}
