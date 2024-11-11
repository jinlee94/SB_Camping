import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import SearchComponent from "../util/SearchComponent";
import { fetchReviewStats } from "../../api/statsApi";

const ReviewComponent = () => {
    const [totalStats, setTotalStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = async (params) => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchReviewStats(params);
            console.log('Fetched data:', data);
            
            if (data && Array.isArray(data)) {
                // 데이터가 비어있는 경우에도 기본 상태 설정
                const stats = data.find(item => item.siteId === 0) || {
                    cleanCount: 0,
                    viewCount: 0,
                    kindCount: 0,
                    silenceCount: 0,
                    facilityCount: 0,
                    photoCount: 0,
                    priceCount: 0,
                    totalReviews: 0,
                    totalReservations: 0,
                    reviewDate: new Date().toISOString().split('T')[0]
                };

                const transformedData = [
                    { name: "깨끗해요", value: stats.cleanCount },
                    { name: "뷰가 좋아요", value: stats.viewCount },
                    { name: "친절해요", value: stats.kindCount },
                    { name: "조용히 쉬기 좋아요", value: stats.silenceCount },
                    { name: "시설이 좋아요", value: stats.facilityCount },
                    { name: "사진이 잘 나와요", value: stats.photoCount },
                    { name: "가성비가 좋아요", value: stats.priceCount }
                ].sort((a, b) => b.value - a.value);

                setTotalStats({
                    stats,
                    chartData: transformedData
                });
            }
        } catch (err) {
            setError(err.message);
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // 현재 날짜 가져오기
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        // YYYY-MM-DD 형식으로 변환
        const startDate = firstDayOfMonth.toISOString().split('T')[0];
        const endDate = lastDayOfMonth.toISOString().split('T')[0];

        // 초기 데이터 fetch
        fetchData({
            dateType: 'month',
            startDate: startDate,
            endDate: endDate,
            siteId: null
        });
    }, []);

    // SearchComponent에 초기값 전달을 위해 기본값도 설정
    const initialSearchParams = {
        dateType: 'month',
        startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
        endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0],
        siteId: null
    };

    const onSearch = (searchParams) => {
        fetchData(searchParams);
    };

    const renderStats = () => {
        if (!totalStats?.stats) return null;

        const { stats } = totalStats;
        const reviewRate = stats.totalReservations > 0
            ? ((stats.totalReviews / stats.totalReservations) * 100).toFixed(1)
            : 0;

        return (
            <div className="stats-summary bg-white p-4 rounded-lg shadow mb-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="stat-item">
                        <h4 className="text-lg font-semibold text-gray-700">총 예약 수</h4>
                        <p className="text-2xl font-bold text-blue-600">{stats.totalReservations}개</p>
                    </div>
                    <div className="stat-item">
                        <h4 className="text-lg font-semibold text-gray-700">총 리뷰 수</h4>
                        <p className="text-2xl font-bold text-green-600">{stats.totalReviews}개</p>
                    </div>
                    <div className="stat-item">
                        <h4 className="text-lg font-semibold text-gray-700">리뷰 작성 비율</h4>
                        <p className="text-2xl font-bold text-purple-600">{reviewRate}%</p>
                    </div>
                    <div className="stat-item">
                        <h4 className="text-lg font-semibold text-gray-700">조회 날짜</h4>
                        <p className="text-xl font-medium text-gray-600">{stats.reviewDate}</p>
                    </div>
                </div>
            </div>
        );
    };

    const NoDataMessage = () => (
        <div className="h-64 flex items-center justify-center bg-gray-100 text-gray-500 rounded-lg">
            해당 기간에 데이터가 존재하지 않습니다.
        </div>
    );

    const renderChart = () => {
        // 데이터가 없거나 모든 값이 0인 경우 체크
        const hasData = totalStats.chartData.some(item => item.value > 0);
        
        if (!hasData) {
            return <NoDataMessage />;
        }

        return (
            <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-xl font-bold text-gray-800 mb-4">태그 통계</h3>
                <div className="space-y-2">
                    {totalStats.chartData.map((item, index) => {
                        const getBarColor = (tagName) => {
                            switch (tagName) {
                                case "깨끗해요":
                                    return "bg-blue-400";
                                case "뷰가 좋아요":
                                    return "bg-green-400";
                                case "친절해요":
                                    return "bg-yellow-400";
                                case "조용히 쉬기 좋아요":
                                    return "bg-purple-400";
                                case "시설이 좋아요":
                                    return "bg-red-400";
                                case "사진이 잘 나와요":
                                    return "bg-indigo-400";
                                case "가성비가 좋아요":
                                    return "bg-pink-400";
                                default:
                                    return "bg-gray-400";
                            }
                        };

                        return (
                            <div key={index} className="flex items-center">
                                <div className="w-32 text-sm text-gray-600">{item.name}</div>
                                <div className="flex-1 h-8 bg-gray-100 rounded relative">
                                    <div
                                        className={`h-full ${getBarColor(item.name)} rounded`}
                                        style={{
                                            width: `${(item.value / Math.max(...totalStats.chartData.map(d => d.value))) * 100}%`,
                                            transition: 'width 0.5s ease-in-out'
                                        }}
                                    />
                                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-700">
                                        {item.value}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="p-4">
            <SearchComponent onSearch={onSearch} initialValues={initialSearchParams}/>
            <hr className="my-6"/>
            
            {loading ? (
                <div className="text-center py-8">Loading...</div>
            ) : error ? (
                <div className="text-center text-red-600 py-8">Error: {error}</div>
            ) : totalStats ? (
                <>
                    {renderStats()}
                    {renderChart()}
                </>
            ) : (
                <NoDataMessage />
            )}
        </div>
    );
}

export default ReviewComponent;
