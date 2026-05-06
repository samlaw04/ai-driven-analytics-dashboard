import { useState, useEffect, useCallback } from 'react';
import { Card, Table, Spinner, Button } from 'react-bootstrap';
import { getDRAccountSummary } from '../../clients/BackendConnector';
import './DRAccountSummary.scss';

const getWeekRange = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(now);
    monday.setDate(now.getDate() + mondayOffset);
    monday.setHours(0, 0, 0, 0);
    return {
        startDate: monday.toISOString().replace(/\.\d{3}Z$/, 'Z'),
        endDate: now.toISOString().replace(/\.\d{3}Z$/, 'Z'),
    };
};

const getMonthRange = () => {
    const now = new Date();
    const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    return {
        startDate: firstOfMonth.toISOString().replace(/\.\d{3}Z$/, 'Z'),
        endDate: now.toISOString().replace(/\.\d{3}Z$/, 'Z'),
    };
};

const formatMinutesToHours = (minutes) => {
    if (minutes == null) return '—';
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
};

const TrendIndicator = ({ value, format }) => {
    const rounded = format === 'minutes'
        ? Math.round(value)
        : format === 'kwh'
            ? Math.round(value * 10) / 10
            : Math.round(value);

    const display = format === 'minutes'
        ? formatMinutesToHours(Math.abs(rounded))
        : format === 'kwh'
            ? `${Math.abs(rounded).toFixed(1)}`
            : Math.abs(rounded);

    if (rounded > 0) {
        return <span className="trend trend--positive">▲ +{display}</span>;
    }
    if (rounded < 0) {
        return <span className="trend trend--negative">▼ -{display}</span>;
    }
    return <span className="trend trend--neutral">— 0</span>;
};

const formatValue = (value, format) => {
    if (value == null) return '—';
    if (format === 'kwh') return `${value.toFixed(1)} KWH`;
    if (format === 'minutes') return formatMinutesToHours(value);
    return value;
};

const DRAccountSummary = () => {
    const [weekData, setWeekData] = useState(null);
    const [monthData, setMonthData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const fetchSummary = useCallback(async () => {
        const customerId = sessionStorage.getItem('customerId');
        if (!customerId) return;

        setLoading(true);
        setError(false);

        try {
            const weekRange = getWeekRange();
            const monthRange = getMonthRange();

            const [week, month] = await Promise.all([
                getDRAccountSummary(customerId, weekRange.startDate, weekRange.endDate),
                getDRAccountSummary(customerId, monthRange.startDate, monthRange.endDate),
            ]);

            setWeekData(week);
            setMonthData(month);
        } catch {
            setError(true);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSummary();
    }, [fetchSummary]);

    const rows = weekData && monthData
        ? [
            {
                metric: 'Plug-ins',
                week: weekData.numberOfPlugSessions,
                month: monthData.numberOfPlugSessions,
                trend: monthData.numberOfPlugSessions - weekData.numberOfPlugSessions,
                format: 'number',
            },
            {
                metric: 'DR Events Scheduled',
                week: weekData.drEventsScheduled,
                month: monthData.drEventsScheduled,
                trend: monthData.drEventsScheduled - weekData.drEventsScheduled,
                format: 'number',
            },
            {
                metric: 'DR Events Participated in',
                week: weekData.drEventsParticipatedIn,
                month: monthData.drEventsParticipatedIn,
                trend: monthData.drEventsParticipatedIn - weekData.drEventsParticipatedIn,
                format: 'number',
            },
            {
                metric: 'DR Events Overridden',
                week: weekData.drEventsOverridden,
                month: monthData.drEventsOverridden,
                trend: monthData.drEventsOverridden - weekData.drEventsOverridden,
                format: 'number',
            },
            {
                metric: 'KWH Shifted',
                week: weekData.kwhShifted,
                month: monthData.kwhShifted,
                trend: monthData.kwhShifted - weekData.kwhShifted,
                format: 'kwh',
            },
            {
                metric: 'Total time plugged in',
                week: weekData.totalTimePluggedIn,
                month: monthData.totalTimePluggedIn,
                trend: monthData.totalTimePluggedIn - weekData.totalTimePluggedIn,
                format: 'minutes',
            },
        ]
        : [];

    if (loading) {
        return (
            <Card className="activity-summary-card">
                <Card.Body className="d-flex justify-content-center align-items-center py-5">
                    <Spinner animation="border" size="sm" className="activity-spinner" />
                </Card.Body>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className="activity-summary-card">
                <Card.Body className="d-flex flex-column align-items-center justify-content-center py-5 gap-2">
                    <div className="activity-error-icon">!</div>
                    <p className="activity-error-title mb-0">Unable to load activity data</p>
                    <p className="activity-error-subtitle mb-2">
                        We're having trouble connecting to the server. Please try again.
                    </p>
                    <Button className="activity-retry-btn" onClick={fetchSummary}>
                        Retry
                    </Button>
                </Card.Body>
            </Card>
        );
    }

    return (
        <Card className="activity-summary-card">
            <Card.Body className="p-3">
                <Card.Title className="activity-summary-title mb-3">
                    Activity Summary
                </Card.Title>
                <Table className="activity-summary-table" borderless responsive>
                    <thead>
                    <tr>
                        <th className="col-metric">METRIC</th>
                        <th className="col-value">THIS WEEK</th>
                        <th className="col-value">THIS MONTH</th>
                        <th className="col-trend">TREND (DIRECTIONAL)</th>
                    </tr>
                    </thead>
                    <tbody>
                    {rows.map(({ metric, week, month, trend, format }) => (
                        <tr key={metric}>
                            <td className="cell-metric">{metric}</td>
                            <td className="cell-value">{formatValue(week, format)}</td>
                            <td className="cell-value">{formatValue(month, format)}</td>
                            <td className="cell-trend">
                                <TrendIndicator value={trend} format={format} />
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            </Card.Body>
        </Card>
    );
};

export default DRAccountSummary;
