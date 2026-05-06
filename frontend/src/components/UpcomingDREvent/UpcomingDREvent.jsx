import { useState, useEffect } from 'react';
import { Card, Spinner } from 'react-bootstrap';
import { getUpcomingDREvent } from '../../clients/BackendConnector';
import './UpcomingDREvent.scss';

const isToday = (isoString) => {
    const eventDate = new Date(isoString);
    const today = new Date();
    return (
        eventDate.getDate() === today.getDate() &&
        eventDate.getMonth() === today.getMonth() &&
        eventDate.getFullYear() === today.getFullYear()
    );
};

const formatDateLabel = (isoString) => {
    if (isToday(isoString)) return 'TODAY';
    const date = new Date(isoString);
    return date.toLocaleDateString('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
    }).toUpperCase();
};

// "15:00" → "3:00 PM"
const formatTo12hr = (time24) => {
    if (!time24) return '';
    const [hourStr, minuteStr] = time24.split(':');
    let hours = parseInt(hourStr);
    const minutes = minuteStr || '00';
    const period = hours >= 12 ? 'PM' : 'AM';
    if (hours > 12) hours -= 12;
    if (hours === 0) hours = 12;
    return `${hours}:${minutes} ${period}`;
};

// drEventWindow comes from backend as a JSON string e.g. '{"start":"15:00","end":"16:00"}'
const parseEventWindow = (drEventWindow) => {
    if (!drEventWindow) return null;
    if (typeof drEventWindow === 'object') return drEventWindow;
    try {
        return JSON.parse(drEventWindow);
    } catch {
        return null;
    }
};

// Timeline starts at 12 PM — labels: 12 PM → 6 PM → 12 AM → 6 AM → 12
// hours 12–23 → offset 0–11, hours 0–11 → offset 12–23
const timeToTimelineOffset = (time24) => {
    if (!time24) return 0;
    const [hourStr, minuteStr] = time24.split(':');
    const hours = parseInt(hourStr);
    const minutes = parseInt(minuteStr || '0');
    const decimalHours = hours + minutes / 60;
    return decimalHours >= 12 ? decimalHours - 12 : decimalHours + 12;
};

const getTimelinePositions = (parsedWindow) => {
    if (!parsedWindow?.start || !parsedWindow?.end) {
        return { startPct: 0, widthPct: 0 };
    }
    const startOffset = timeToTimelineOffset(parsedWindow.start);
    const endOffset = timeToTimelineOffset(parsedWindow.end);
    return {
        startPct: (startOffset / 24) * 100,
        widthPct: ((endOffset - startOffset) / 24) * 100,
    };
};

const UpcomingDREvent = () => {
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const customerId = sessionStorage.getItem('customerId');
        if (!customerId) {
            setError(true);
            setLoading(false);
            return;
        }

        const fetchUpcomingEvent = async () => {
            try {
                const data = await getUpcomingDREvent(customerId);
                setEvent(data);
            } catch {
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchUpcomingEvent();
    }, []);

    const renderContent = () => {
        if (loading) {
            return (
                <div className="d-flex justify-content-center align-items-center p-4">
                    <Spinner animation="border" size="sm" className="upcoming-dr-spinner" />
                </div>
            );
        }

        if (error) {
            return (
                <div className="upcoming-dr-state-box upcoming-dr-state-box--error">
                    <p className="upcoming-dr-state-title">Unable to load upcoming event</p>
                </div>
            );
        }

        if (!event || !event.drEventDate) {
            return (
                <div className="upcoming-dr-state-box">
                    <p className="upcoming-dr-state-title upcoming-dr-state-title--empty">
                        No DR Event Scheduled
                    </p>
                    <p className="upcoming-dr-state-subtitle">
                        Please wait for your Utility Company to schedule a DR Event
                    </p>
                </div>
            );
        }

        const parsedWindow = parseEventWindow(event.drEventWindow);
        const { startPct, widthPct } = getTimelinePositions(parsedWindow);
        const dateLabel = formatDateLabel(event.drEventDate);
        const startFormatted = formatTo12hr(parsedWindow?.start);
        const endFormatted = formatTo12hr(parsedWindow?.end);

        return (
            <>
                {/* ── Event box ── */}
                <div className="upcoming-dr-event-box">
                    <span className="upcoming-dr-badge">NEXT CONFIRMED DR EVENT</span>
                    <p className="upcoming-dr-event-time">
                        {dateLabel}, {startFormatted} — {endFormatted}
                    </p>
                </div>

                {/* ── Timeline ── */}
                <div className="upcoming-dr-timeline-section">
                    <p className="upcoming-dr-timeline-label">PARTICIPATION TIMELINE (24H)</p>
                    <div className="upcoming-dr-timeline-track">
                        <div
                            className="upcoming-dr-timeline-bar"
                            style={{ left: `${startPct}%`, width: `${widthPct}%` }}
                        />
                    </div>
                    <div className="upcoming-dr-timeline-labels">
                        <span>12 PM</span>
                        <span>6 PM</span>
                        <span>12 AM</span>
                        <span>6 AM</span>
                        <span>12</span>
                    </div>
                    <div className="upcoming-dr-legend">
                        <span className="upcoming-dr-legend-item">
                            <span className="upcoming-dr-legend-dot upcoming-dr-legend-dot--event" />
                            DR Event
                        </span>
                        <span className="upcoming-dr-legend-item">
                            <span className="upcoming-dr-legend-dot upcoming-dr-legend-dot--normal" />
                            Normal Grid
                        </span>
                    </div>
                </div>
            </>
        );
    };

    return (
        <div className="upcoming-dr-wrapper">
            <h2 className="upcoming-dr-heading">Upcoming DR Event</h2>
            <Card className="upcoming-dr-card">
                <Card.Body className="p-3 d-flex flex-column gap-3">
                    {renderContent()}
                </Card.Body>
            </Card>
        </div>
    );
};

export default UpcomingDREvent;
