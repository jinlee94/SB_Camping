// src/admin/pages/notice/AddPage.js

import React from 'react';
import AddComponent from '../../components/notice/AddComponent';
import {handleBackToList} from '../../components/notice/AddComponent' //목록으로 가는 함수
import {Link} from "react-router-dom";


const AddPage = () => {
    return (
        <div>
            <a href={"/admin/notices/list"} style={{textDecoration: 'none', color: 'black'}}>
            </a>
            <AddComponent/>
        </div>
    );
};

export default AddPage;
