import { useState, useEffect } from 'react';
import { Card, Spinner } from 'react-bootstrap';
import {
    getDPAccountSummary, getDRAccountSummary,
    getUserProfile,
    getUtilityAverageStatistics
} from '../../clients/BackendConnector';
import './NeighbourhoodWatch.scss';

const getMonthDateRange = (timeToCover) => {
    const now = new Date();
    const start = new Date()
    start.setDate(start.getDate() - timeToCover)
    return {
        startDate: start.toISOString(),
        endDate: now.toISOString(),
    };
};

const MetricBar = ({ label, customerValue, avgValue }) => {
    const safeCustomer = customerValue ?? 0;
    const safeAvg = avgValue ?? 0;
    const max = Math.max(safeCustomer, safeAvg, 1);
    const customerPct = (safeCustomer / max) * 100;

    return (
        <div className="nw-metric">
            <p className="nw-metric-label">{label}</p>
            <div className="nw-bar-track">
                <div
                    className="nw-bar-fill"
                    style={{ width: `${customerPct}%` }}
                />
            </div>
            <p className="nw-metric-values">
                You: {safeCustomer.toFixed(1)} | Avg: {safeAvg.toFixed(1)}
            </p>
        </div>
    );
};

const NeighbourhoodWatch = ({ programType }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [utilityAvg, setUtilityAvg] = useState(null);
    const [customerStats, setCustomerStats] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const customerId = sessionStorage.getItem('customerId');
                if (!customerId) { setError(true); setLoading(false); return; }

                const { startDate, endDate } = getMonthDateRange(31);

                const profile = await getUserProfile(customerId);
                const utilityId = profile?.utility?.utilityId;
                if (!utilityId) { setError(true); setLoading(false); return; }

                const [avgData, summaryData] = await Promise.all([
                    getUtilityAverageStatistics(utilityId),
                    programType === 'DP'
                        ? getDPAccountSummary(customerId, startDate, endDate)
                        : getDRAccountSummary(customerId, startDate, endDate),
                ]);

                setUtilityAvg(avgData);
                setCustomerStats(summaryData);
            } catch {
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [programType]);

    const dpMetrics = [
        {
            label: 'kWh Shifted',
            customerValue: customerStats?.kwhShifted,
            avgValue: utilityAvg?.kwhShifted,
        },
        {
            label: 'Number of Plug-ins',
            customerValue: customerStats?.numberOfPlugSessions,
            avgValue: utilityAvg?.numberOfPlugIns,
        },
        {
            label: 'Schedules Followed',
            customerValue: customerStats?.schedulesFollowed,
            avgValue: utilityAvg?.schedulesFollowed,
        },
    ];

    const drMetrics = [
        {
            label: 'KWH Shifted',
            customerValue: customerStats?.kwhShifted,
            avgValue: utilityAvg?.kwhShifted,
        },
        {
            label: 'Num of Plug-ins',
            customerValue: customerStats?.numberOfPlugSessions,
            avgValue: utilityAvg?.numberOfPlugIns,
        },
        {
            label: 'DR Events Completed',
            customerValue: customerStats?.drEventsParticipatedIn,
            avgValue: utilityAvg?.drEventsCompleted,
        },
    ];

    const metrics = programType === 'DP' ? dpMetrics : drMetrics;

    const renderContent = () => {
        if (loading) {
            return (
                <div className="d-flex justify-content-center align-items-center p-4">
                    <Spinner animation="border" size="sm" className="nw-spinner" />
                </div>
            );
        }

        if (error) {
            return (
                <div className="nw-error-box">
                    <p className="nw-error-title">Vehicle Connection Lost</p>
                    <p className="nw-error-subtitle">Check FordPass or vehicle connectivity</p>
                </div>
            );
        }

        return (
            <div className="nw-metrics-list">
                {metrics.map((metric) => (
                    <MetricBar
                        key={metric.label}
                        label={metric.label}
                        customerValue={metric.customerValue}
                        avgValue={metric.avgValue}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="nw-wrapper">
            <h2 className="nw-heading">Neighbourhood Watch</h2>
            <Card className="nw-card">
                <Card.Body className="p-3">
                    {renderContent()}
                </Card.Body>
            </Card>
        </div>
    );
};

export default NeighbourhoodWatch;
