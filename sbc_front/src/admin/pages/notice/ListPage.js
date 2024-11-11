
import React from 'react';
import ListComponent from '../../components/notice/ListComponent';

const ListPage = () => {
    return (
        <div>
            <a href={"/admin/notices/list"} style={{textDecoration: 'none', color: 'black'}}>
            </a>
            <ListComponent/>
        </div>
    );
};

export default ListPage;
