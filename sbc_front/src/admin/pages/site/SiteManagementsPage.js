//구역관리 컴포넌트를 담을 페이지


import SiteManagements from "../../components/site/SiteManagements";
import BasicLayout from "../../layouts/BasicLayout";
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux'; // 현재 로그인 한 사용자의 권한 검증을 위해
import { useNavigate } from 'react-router-dom'; // useNavigate 임포트

const SiteManagementPage = () => {
    // Redux 스토어에서 loginSlice 접근
    const loginState = useSelector((state) => state.loginSlice);
    const navigate = useNavigate();

    useEffect(() => {
        // 현재 로그인한.유저의?.권한이 !== 관리자
        // 경우 '/'(기본 메인)경로로
        console.log('isAuthenticated 상태:', loginState.isAuthenticated);
        console.log('로그인 상태:', loginState);

        if (loginState.member?.memberRole !== 'ROLE_ADMIN') {
            navigate('/'); // 이동 할 경로
        }
    }, [loginState, navigate]);





    return (
        <BasicLayout>
            {/*메뉴도 필요 없을 듯 <SiteMenu/>*/}
            <div className="max-w-full mx-auto p-6 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-6">구역 관리 페이지</h1>

                {/* SiteManagements 컴포넌트 렌더링 */}
                <div className="mt-4 border-t border-gray-300 pt-4">
                    <SiteManagements/>
                </div>
            </div>
        </BasicLayout>

    );
};

export default SiteManagementPage;
