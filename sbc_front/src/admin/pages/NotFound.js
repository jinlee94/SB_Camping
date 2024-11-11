import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate();

    const goToHomePage = () => {
        navigate('/'); // 메인 페이지로 이동
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center">
            <h1 className="text-6xl font-bold text-gray-800 mb-4">404 - 페이지를 찾을 수 없습니다</h1>
            <p className="text-lg text-gray-600 mb-8">
                요청하신 페이지를 찾을 수 없습니다.
            </p>
            <button
                onClick={goToHomePage}
                className="btn btn-primary px-4 py-2 text-lg rounded"
            >
                메인 페이지로
            </button>
        </div>
    );
};

export default NotFound;
