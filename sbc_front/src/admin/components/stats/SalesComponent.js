import React from "react";
import Table from "react-bootstrap/Table";
import SearchComponent from "../util/SearchComponent";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SalesComponent = ({ salesStats, loading, error, dateType, onSearch }) => {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('ko-KR', {
            style: 'currency',
            currency: 'KRW',
            maximumFractionDigits: 0
        }).format(amount).replace('₩', '') + '원';
    };

    const formatDate = (dateString) => {
        if (dateType === 'year') {
            return dateString.substring(0, 7); // YYYY-MM
        }
        return dateString; // YYYY-MM-DD for month and day
    };

    const aggregateMonthlyData = (statsList) => {
        const monthlyData = {};
        statsList.forEach(stat => {
            const month = stat.resDate.substring(0, 7);
            if (!monthlyData[month]) {
                monthlyData[month] = {
                    resDate: month,
                    scheduledCount: 0,
                    scheduledAmount: 0,
                    completedCount: 0,
                    completedAmount: 0
                };
            }
            monthlyData[month].scheduledCount += stat.scheduledCount;
            monthlyData[month].scheduledAmount += stat.scheduledAmount;
            monthlyData[month].completedCount += stat.completedCount;
            monthlyData[month].completedAmount += stat.completedAmount;
        });
        return Object.values(monthlyData);
    };

    const renderTableContent = () => {
        if (!salesStats || !salesStats.statsList) {
            return <tr><td colSpan="7">데이터가 없습니다.</td></tr>;
        }

        let statsToRender = salesStats.statsList;

        if (dateType === 'year') {
            statsToRender = aggregateMonthlyData(statsToRender);
        } else {
            // 월별, 일별 검색 시 데이터가 모두 0인 날짜 행은 제외
            statsToRender = statsToRender.filter(stat => 
                stat.scheduledCount > 0 || stat.completedCount > 0 ||
                stat.scheduledAmount > 0 || stat.completedAmount > 0
            );
        }

        return (
            <>
                {salesStats.totalStats && (
                    <tr style={{ fontWeight: 'bold' }}>
                        <td>합계</td>
                        <td>{salesStats.totalStats.totalCompletedCount + salesStats.totalStats.totalScheduledCount}</td>
                        <td>{formatCurrency(salesStats.totalStats.totalCompletedAmount + salesStats.totalStats.totalScheduledAmount)}</td>
                        <td>{salesStats.totalStats.totalCompletedCount}</td>
                        <td>{formatCurrency(salesStats.totalStats.totalCompletedAmount)}</td>
                        <td>{salesStats.totalStats.totalScheduledCount}</td>
                        <td>{formatCurrency(salesStats.totalStats.totalScheduledAmount)}</td>
                    </tr>
                )}
                {statsToRender.map((stat, index) => (
                    <tr key={index}>
                        <td>{formatDate(stat.resDate)}</td>
                        <td>{stat.scheduledCount + stat.completedCount}</td>
                        <td>{formatCurrency(stat.scheduledAmount + stat.completedAmount)}</td>
                        <td>{stat.completedCount}</td>
                        <td>{formatCurrency(stat.completedAmount)}</td>
                        <td>{stat.scheduledCount}</td>
                        <td>{formatCurrency(stat.scheduledAmount)}</td>
                    </tr>
                ))}
            </>
        );
    };

    const renderGraph = () => {
        if (!salesStats || !salesStats.statsList || salesStats.statsList.length === 0) {
            return (
                <div className="h-96 flex items-center justify-center bg-gray-100 text-gray-500">
                    해당 기간에 데이터가 존재하지 않습니다.
                </div>
            );
        }

        let data = dateType === 'year' ? aggregateMonthlyData(salesStats.statsList) : salesStats.statsList;

        // 데이터 가공
        data = data.map(stat => ({
            date: formatDate(stat.resDate),
            실매출: stat.scheduledAmount + stat.completedAmount,
            이용완료: stat.completedAmount,
            이용예정: stat.scheduledAmount
        }));

        return (
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="실매출" fill="#8884d8" />
                <Bar dataKey="이용완료" fill="#82ca9d" />
                <Bar dataKey="이용예정" fill="#ffc658" />
            </BarChart>
        );
    };

    return (
        <div className="container mx-auto px-4">
            <SearchComponent onSearch={onSearch} dateType={dateType} />
            <hr className="my-6" />
            <div className="mb-10 h-96"> {/* 높이를 고정합니다 */}
                <ResponsiveContainer width="100%" height="100%">
                    {renderGraph()}
                </ResponsiveContainer>
            </div>
            <div className="mt-10">
                <Table bordered className="w-full">
                    <thead>
                    <tr>
                        <th rowSpan="2">날짜</th>
                        <th colSpan="2">실매출</th>
                        <th colSpan="2">이용완료</th>
                        <th colSpan="2">이용예정</th>
                    </tr>
                    <tr>
                        <th>예약건수</th>
                        <th>금액</th>
                        <th>예약건수</th>
                        <th>금액</th>
                        <th>예약건수</th>
                        <th>금액</th>
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

export default SalesComponent;
