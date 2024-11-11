package com.sbcamping.admin.site.repository;


import com.sbcamping.domain.Site;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@EnableJpaRepositories(basePackages = "com.sbcamping.admin.site.repository")    //적용범위 할당
public interface AdminSiteRepository extends JpaRepository<Site,Long> {
}
