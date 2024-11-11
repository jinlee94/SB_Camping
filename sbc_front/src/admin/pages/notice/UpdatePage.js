// src/admin/pages/notice/UpdatePage.js

import React from 'react';
import UpdateComponent from '../../components/notice/UpdateComponent';

const UpdatePage = () => {
    return (
        <div>
            <a href={"/admin/notices/list"} style={{textDecoration: 'none', color: 'black'}}>
            </a>
            <UpdateComponent/>
        </div>
    );
};

export default UpdatePage;
