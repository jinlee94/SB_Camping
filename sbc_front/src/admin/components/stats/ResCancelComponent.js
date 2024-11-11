import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import SearchComponent from "../util/SearchComponent";
import { fetchCancelStats } from "../../api/statsApi";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ResCancelComponent = () => {
    // 현재 월의 시작일과 마지막일 계산
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // 초기 검색 파라미터 설정
    const initialSearchParams = {
        dateType: 'month',
        startDate: firstDayOfMonth.toISOString().split('T')[0],
        endDate: lastDayOfMonth.toISOString().split('T')[0],
        siteId: null
    };

    const [cancelStats, setCancelStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchParams, setSearchParams] = useState(initialSearchParams);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('ko-KR', {
            style: 'currency',
            currency: 'KRW',
            maximumFractionDigits: 0
        }).format(amount).replace('₩', '') + '원';
    };

    const onSearch = async (newSearchParams) => {
        setSearchParams(newSearchParams);
        setLoading(true);
        try {
            const data = await fetchCancelStats(newSearchParams);
            setCancelStats(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // 컴포넌트 마운트 시 초기 데이터 로드
    useEffect(() => {
        onSearch(initialSearchParams);
    }, []);

    const renderTableContent = () => {
        if (loading) return <tr><td colSpan="3">Loading...</td></tr>;
        if (error) return <tr><td colSpan="3">Error: {error}</td></tr>;

        // 총합을 계산하기 위한 수
        let totalCancelCount = 0;
        let totalCancelAmount = 0;

        // 데이터 행 추가
        const rows = cancelStats && cancelStats.stats ? cancelStats.stats.map((stat, index) => {
            let displayDate = stat.resCancelDate;

            // 날짜 형식에 따라 출력 형식을 조정합니다.
            if (searchParams.dateType === 'year') {
                displayDate = displayDate.substring(0, 7); // "YYYY-MM"
            }

            // 총합을 계산합니다.
            totalCancelCount += stat.cancelCount;
            totalCancelAmount += stat.cancelAmount;

            // 데이터가 있는 경우에만 행 추가 (취소건수가 0이 아닐 경우)
            if ((searchParams.dateType === 'day' || searchParams.dateType === 'month') && stat.cancelCount > 0) {
                return (
                    <tr key={index}>
                        <td>{displayDate}</td>
                        <td>{stat.cancelCount}</td>
                        <td>{formatCurrency(stat.cancelAmount)}</td>
                    </tr>
                );
            } else if (searchParams.dateType === 'year') {
                // 연도별 데이터는 항상 출력
                return (
                    <tr key={index}>
                        <td>{displayDate}</td>
                        <td>{stat.cancelCount}</td>
                        <td>{formatCurrency(stat.cancelAmount)}</td>
                    </tr>
                );
            }
            return null; // 취소건수가 0인 경우는 null 반환
        }).filter(row => row !== null) : []; // null 제외

        // 합계 행 생성
        const totalRow = (
            <tr key="total" style={{ fontWeight: 'bold' }}>
                <td>합계</td>
                <td>{totalCancelCount}</td>
                <td>{formatCurrency(totalCancelAmount)}</td>
            </tr>
        );

        // 데이터가 없을 때 메시지 표시
        if (!cancelStats || !cancelStats.stats || cancelStats.stats.length === 0) {
            // 일별 및 월별 검색 시 데이터가 없을 때만 메시지 표시
            if (searchParams.dateType === 'day' || searchParams.dateType === 'month') {
                return <tr><td colSpan="3">해당 기간에 데이터가 존재하지 않습니다.</td></tr>;
            }
        }

        return (
            <>
                {totalRow}
                {rows.length > 0 ? rows : <tr><td colSpan="3">해당 기간에 데이터가 존재하지 않습니다.</td></tr>}
            </>
        );
    };

    const renderGraph = () => {
        if (!cancelStats || !cancelStats.stats || cancelStats.stats.length === 0 || 
            cancelStats.stats.every(stat => stat.cancelCount === 0 && stat.cancelAmount === 0)) {
            return (
                <div className="h-full flex items-center justify-center bg-gray-100 text-gray-500">
                    해당 기간에 데이터가 존재하지 않습니다.
                </div>
            );
        }

        const data = cancelStats.stats.map(stat => ({
            date: searchParams.dateType === 'year' ? stat.resCancelDate.substring(0, 7) : stat.resCancelDate,
            취소건수: stat.cancelCount,
            취소금액: stat.cancelAmount
        }));

        return (
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="취소건수" fill="#8884d8" />
                    <Bar yAxisId="right" dataKey="취소금액" fill="#82ca9d" />
                </BarChart>
            </ResponsiveContainer>
        );
    };

    return (
        <div className="container mx-auto px-4">
            <SearchComponent 
                onSearch={onSearch} 
                dateType={searchParams.dateType}
                initialValues={initialSearchParams} // SearchComponent에 초기값 전달
            />
            <hr className="my-6" />
            <div className="mb-10 h-96">
                {renderGraph()}
            </div>
            <div className="mt-10">
                <Table bordered className="w-full">
                    <thead>
                        <tr>
                            <th>예약 취소 날짜</th>
                            <th>취소건수</th>
                            <th>취소 금액</th>
                        </tr>
                    </thead>
                    <tbody>
                        {renderTableContent()}
                    </tbody>
                </Table>
            </div>
        </div>
    );
};

export default ResCancelComponent;
