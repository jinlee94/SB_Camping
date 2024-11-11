import React from 'react';
import {Outlet} from "react-router-dom";
import CommunityMenu from "../../layouts/CommunityMenu";
import BasicLayout from "../../layouts/BasicLayout";
import useCustomLogin from "../../hooks/useCustomLogin";



const ReviewIndexPage = () => {
    return (
        <BasicLayout>
            <div>
                <CommunityMenu/>
            </div>
            <div className="mt-3"><h1>리뷰 게시판</h1></div>
            <hr/>
            <div>
                <Outlet/>
            </div>
        </BasicLayout>
    );
};

export default ReviewIndexPage;