import { useState, useEffect } from 'react';
import { Card, Spinner } from 'react-bootstrap';
import { getCurrentSchedule } from '../../clients/BackendConnector';
import './CurrentSchedule.scss';

const timeToDecimalHours = (time24) => {
    if (!time24) return 0;
    const [hourStr, minuteStr] = time24.split(':');
    return parseInt(hourStr) + parseInt(minuteStr || '0') / 60;
};

const getWindowPositions = (startStr, endStr) => {
    const start = timeToDecimalHours(startStr);
    let end = timeToDecimalHours(endStr);
    if (end <= start) end += 24;

    const completeEnd = end + 2;

    return {
        chargePct: {
            startPct: (start / 24) * 100,
            widthPct: ((Math.min(end, 24) - start) / 24) * 100,
        },
        completePct: {
            startPct: (Math.min(end, 24) / 24) * 100,
            widthPct: ((Math.min(completeEnd, 24) - Math.min(end, 24)) / 24) * 100,
        },
    };
};

const parseChargeWindows = (chargeWindowsStr) => {
    if (!chargeWindowsStr) return [];
    try {
        const parsed = typeof chargeWindowsStr === 'string'
            ? JSON.parse(chargeWindowsStr)
            : chargeWindowsStr;
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
};

const CurrentSchedule = () => {
    const [schedule, setSchedule] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const customerId = sessionStorage.getItem('customerId');
        if (!customerId) {
            setError(true);
            setLoading(false);
            return;
        }

        const fetchSchedule = async () => {
            try {
                const data = await getCurrentSchedule(customerId);
                setSchedule(data);
            } catch {
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchSchedule();
    }, []);

    const renderContent = () => {
        if (loading) {
            return (
                <div className="d-flex justify-content-center align-items-center p-4">
                    <Spinner animation="border" size="sm" className="schedule-spinner" />
                </div>
            );
        }

        if (error) {
            return (
                <div className="schedule-state-box schedule-state-box--error">
                    <p className="schedule-state-title">Vehicle Connection Lost</p>
                    <p className="schedule-state-subtitle">Check FordPass or vehicle connectivity</p>
                </div>
            );
        }

        if (!schedule) {
            return (
                <div className="schedule-state-box">
                    <p className="schedule-state-title">No active session</p>
                </div>
            );
        }

        const windows = parseChargeWindows(schedule.chargeWindows);

        return (
            <>
                {/* ── Top row: info left / image right ── */}
                <div className="schedule-top-row">
                    <div className="schedule-vehicle-info">
                        <p className="schedule-vehicle-name">
                            {schedule.vehicleName || 'My Vehicle'}
                        </p>
                        <p className="schedule-battery-text">
                            <span className="schedule-battery-pct">
                                {schedule.currentBatteryPercentage}%
                            </span>
                            {' '}Plugged In
                        </p>
                    </div>

                    <div className="schedule-image-wrapper">
                        {schedule.vehicleImage ? (
                            <img
                                className="schedule-vehicle-image"
                                src={`data:image/jpeg;base64,${schedule.vehicleImage}`}
                                alt={schedule.vehicleName || 'Vehicle'}
                            />
                        ) : (
                            <span className="schedule-image-placeholder">Vehicle Image</span>
                        )}
                    </div>
                </div>

                {/* ── Timeline ── */}
                {windows.length > 0 && (
                    <div className="schedule-timeline-section">
                        <div className="schedule-timeline-track">
                            {windows.map((w, i) => {
                                const { chargePct, completePct } = getWindowPositions(w.start, w.end);
                                return (
                                    <div key={i}>
                                        {/* Charge window — dark blue */}
                                        <div
                                            className="schedule-timeline-bar schedule-timeline-bar--charge"
                                            style={{
                                                left: `${chargePct.startPct}%`,
                                                width: `${chargePct.widthPct}%`,
                                            }}
                                        />
                                        {/* Complete window — green */}
                                        <div
                                            className="schedule-timeline-bar schedule-timeline-bar--complete"
                                            style={{
                                                left: `${completePct.startPct}%`,
                                                width: `${completePct.widthPct}%`,
                                            }}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                        <div className="schedule-timeline-labels">
                            <span>12 AM</span>
                            <span>6 AM</span>
                            <span>12 PM</span>
                            <span>6 PM</span>
                            <span>12 AM</span>
                        </div>

                        {/* ── Legend ── */}
                        <div className="schedule-legend">
                            <span className="schedule-legend-item">
                                <span className="schedule-legend-dot schedule-legend-dot--charge" />
                                Charging
                            </span>
                            <span className="schedule-legend-item">
                                <span className="schedule-legend-dot schedule-legend-dot--stopped" />
                                Stopped
                            </span>
                            <span className="schedule-legend-item">
                                <span className="schedule-legend-dot schedule-legend-dot--complete" />
                                Complete
                            </span>
                        </div>
                    </div>
                )}
            </>
        );
    };

    return (
        <div className="schedule-wrapper">
            <h2 className="schedule-heading">Schedule</h2>
            <Card className="schedule-card">
                <Card.Body className="p-3 d-flex flex-column gap-3">
                    {renderContent()}
                </Card.Body>
            </Card>
        </div>
    );
};

export default CurrentSchedule;
