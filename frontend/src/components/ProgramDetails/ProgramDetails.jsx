import { useState, useEffect } from 'react';
import { Card, Spinner } from 'react-bootstrap';
import { getUtilityProgramDetails } from '../../clients/BackendConnector';
import './ProgramDetails.scss';

const ProgramDetails = () => {
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const utilityId = sessionStorage.getItem('utilityId');
        if (!utilityId) {
            setError(true);
            setLoading(false);
            return;
        }

        const fetchProgramDetails = async () => {
            try {
                const data = await getUtilityProgramDetails(utilityId);
                setDetails(data);
            } catch {
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchProgramDetails();
    }, []);

    const renderContent = () => {
        if (loading) {
            return (
                <div className="d-flex justify-content-center align-items-center flex-grow-1">
                    <Spinner animation="border" size="sm" className="program-details-spinner" />
                </div>
            );
        }

        if (error || !details) {
            return (
                <div className="program-details-unavailable">
                    <p className="mb-0">Service temporarily unavailable</p>
                </div>
            );
        }

        return (
            <div className="program-details-content">
                <h2 className="program-details-title">{details.title}</h2>

                <p className="program-details-description">{details.description_1}</p>

                {details.description_2 && (
                    <p className="program-details-description">{details.description_2}</p>
                )}

                {details.enrollment_desc && (
                    <div className="program-details-incentive">
                        <span className="program-details-incentive-label">Enrollment Bonus</span>
                        <p className="program-details-incentive-text">{details.enrollment_desc}</p>
                    </div>
                )}

                {details.charging_incentives_desc && (
                    <div className="program-details-incentive">
                        <span className="program-details-incentive-label">Charging Incentive</span>
                        <p className="program-details-incentive-text">{details.charging_incentives_desc}</p>
                    </div>
                )}
            </div>
        );
    };

    return (
        <Card className="program-details-card h-100">
            <Card.Body className="p-3 d-flex flex-column">
                <p className="program-details-label">PROGRAM DETAILS</p>
                {renderContent()}
            </Card.Body>
        </Card>
    );
};

export default ProgramDetails;
