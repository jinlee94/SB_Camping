import React, { useState, useEffect } from "react";
import SalesComponent from "../../components/stats/SalesComponent";
import ResCancelComponent from "../../components/stats/ResCancelComponent";
import { Tab, Tabs } from "react-bootstrap";
import { fetchSalesStats } from "../../api/statsApi";

const ReservationSalesPage = () => {
    const [salesStats, setSalesStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [dateType, setDateType] = useState('day');

    const handleSearch = async (searchParams) => {
        setLoading(true);
        try {
            console.log('Search params:', searchParams);

            const { startDate, endDate, dateType, siteId } = searchParams;

            console.log('Date range:', { startDate, endDate });

            if (!startDate || !endDate) {
                throw new Error('Invalid date range');
            }

            const data = await fetchSalesStats(
                startDate,
                endDate,
                dateType,
                siteId ? parseInt(siteId) : undefined
            );
            setDateType(searchParams.dateType);
            console.log('Received data:', data);

            if (data && Array.isArray(data.statsList)) {
                setSalesStats(data);
                setError(null);
            } else {
                throw new Error('Invalid response structure');
            }
        } catch (error) {
            console.error('Error fetching sales stats:', error);
            setError('데이터를 불러오는 데 실패했습니다: ' + error.message);
            setSalesStats(null);
        }
    };

    useEffect(() => {
        // 컴포넌트 마운트 시 초기 데이터 로드
        handleSearch({
            dateType
        });
    }, [dateType]);

    return (
        <>
            <h1>예약 매출 통계</h1>
            <hr />
            <nav>
                <Tabs defaultActiveKey="sales" id="uncontrolled-tab-example" className="mb-3">
                    <Tab eventKey="sales" title="매출 현황">
                        <SalesComponent
                            salesStats={salesStats}
                            loading={loading}
                            error={error}
                            dateType={dateType}
                            onSearch={handleSearch}
                        />
                    </Tab>
                    <Tab eventKey="cancel" title="예약취소 현황">
                        <ResCancelComponent />
                    </Tab>
                </Tabs>
            </nav>
        </>
    );
};

export default ReservationSalesPage;
