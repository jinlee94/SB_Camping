// src/admin/pages/notice/ReadPage.js

import React from 'react';
import ReadComponent from '../../components/notice/ReadComponent';



const ReadPage = () => {
    return (
        <div>
            <a href={"/admin/notices/list"} style={{textDecoration: 'none', color: 'black'}}>
            </a>
            {/*상세페이지 랜더링*/}
            <ReadComponent/>
{/*            <NoticeMoveCompornent/>나중에 공부해보기*/}
        </div>
    );
};

export default ReadPage;
