package com.sbcamping.user.reservation.repository;

import com.sbcamping.domain.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository <Reservation, Long> {

    @Query(value = """
                with date_range as (
                    select res_id,
                    TRUNC(FROM_TZ(CAST(checkin_date AS TIMESTAMP), 'UTC') AT TIME ZONE 'Asia/Seoul') AS checkin_date_KST,
                    TRUNC(FROM_TZ(CAST(checkout_date AS TIMESTAMP), 'UTC') AT TIME ZONE 'Asia/Seoul') AS checkout_date_KST,
                    site_id,
                    FROM_TZ(CAST(checkin_date AS TIMESTAMP), 'UTC') AT TIME ZONE 'Asia/Seoul' + (level - 1) as date_seq
                    from reservation
                    where TRUNC(CHECKOUT_DATE) >= TRUNC(sysdate)
                    AND RES_STATUS = '예약완료'
                    connect by level <= TRUNC(FROM_TZ(CAST(checkout_date AS TIMESTAMP), 'UTC') AT TIME ZONE 'Asia/Seoul')
                                        -
                                        TRUNC(FROM_TZ(CAST(checkin_date AS TIMESTAMP), 'UTC') AT TIME ZONE 'Asia/Seoul') + 1
                                        AND prior res_id = res_id
                                        AND prior dbms_random.value is not null
                    )
                    select SITE_ID, checkin_date_KST, checkout_date_KST, date_seq,
                    case
                    when date_seq < checkout_date_KST then 'true'
                    else 'false'
                    END as result
                    from date_range
            """, nativeQuery = true)
    List<Object[]> getReservations();

    List<Reservation> findByResStatus(String resStatus);

    // 마이페이지 - 나의 예약내역, 회원탈퇴에 사용
    @Query("SELECT r FROM Reservation r JOIN FETCH r.member m JOIN FETCH r.site s WHERE r.member.memberID = :memberId ORDER BY r.resId desc ")
    List<Reservation> findByMemberIdOrderByResId(@Param("memberId") Long memberId);

}
