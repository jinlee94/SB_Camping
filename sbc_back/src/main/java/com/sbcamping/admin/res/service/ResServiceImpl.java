package com.sbcamping.admin.res.service;

import com.sbcamping.admin.res.dto.ResDTO;
import com.sbcamping.admin.res.repository.ResRepository;

import com.sbcamping.domain.Reservation;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
@Log4j2
@RequiredArgsConstructor // 생성자 자동주입
public class ResServiceImpl implements ResService {

    //자동주입 대상은 final로 설정해야함
    //왜?
    //=>안정성과 불변성을 위해서 관행적으로
    //final로 설정시 해당 필드가 변경되지 않음을 명확하게 알 수 있기 때문에 코드의 가독성이 높아지고 유지보수에 용이해진다고 한다
    //다른 개발자들이 보면 단순히 주입받아서 사용한다는것을 한 눈에  봐도 알 수 있기 때문인 것 같음
    private final ResRepository resRepository;    //레포지토리 인스턴스
    private final ModelMapper modelMapper;  //매퍼 인스턴스


    @Override
    public List<ResDTO> getAllRes() {
        log.info("ResServiceImpl/getAllRes-예약전체 불러오는 메서드 시작 ");
        // 모든 Res 엔티티를 불러와서 리스트에 저장pk를 기준으로 내림차순으로 (그래야 최신예약이 상단에 위치함 )
        List<Reservation> res = resRepository.findAll(Sort.by(Sort.Direction.DESC, "resId"));

        log.info("ResServiceImpl/getAllRes-예앾전체 불러오는 메서드 끝 ");
        // ModelMapper를 사용하여 Res 엔티티를 ResDTO로 변환한 후 리스트로 반환
        return res.stream()
                .map(reservation -> modelMapper.map(reservation, ResDTO.class))
                .toList();
    }

}
