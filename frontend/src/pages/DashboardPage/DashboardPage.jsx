import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import { getUserProfile, getUtilityProgramDetails } from '../../clients/BackendConnector';
import './DashboardPage.scss';

const DashboardPage = () => {
    const [programDetails, setProgramDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const customerId = sessionStorage.getItem('customerId');

        if (!customerId) {
            navigate('/login');
            return;
        }

        const fetchDashboardData = async () => {
            try {
                const profile = await getUserProfile(customerId);
                const details = await getUtilityProgramDetails(profile.utilityId);

                sessionStorage.setItem('utilityId', profile.utilityId);
                sessionStorage.setItem('programType', details.programType);

                setProgramDetails(details);
            } catch {
                // Individual components handle their own errors.
                // If the title fails to load we still render the shell.
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [navigate]);

    if (loading) {
        return (
            <div className="dashboard-loading d-flex justify-content-center align-items-center min-vh-100">
                <Spinner animation="border" role="status" className="dashboard-spinner">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    const isDR = programDetails?.programType === 'DR';

    return (
        <div className="dashboard-page">
            <Container className="dashboard-container py-4">

                {programDetails && (
                    <h1 className="dashboard-title text-center mb-4">
                        {programDetails.utilityName} {programDetails.programName}
                    </h1>
                )}

                {/* ── Activity Summary ── */}
                <Row className="mb-3">
                    <Col xs={12}>
                        {/* <ActivitySummary /> */}
                    </Col>
                </Row>

                {/* ── Rewards | Program Details ── */}
                <Row className="mb-3">
                    <Col xs={6} className="pe-2">
                        {/* isDR ? <DRRewards /> : <DPRewards /> */}
                    </Col>
                    <Col xs={6} className="ps-2">
                        {/* <ProgramDetails /> */}
                    </Col>
                </Row>

                {/* ── Schedule / Upcoming Event | Neighbourhood Watch ── */}
                <Row className="mb-3">
                    <Col xs={6} className="pe-2">
                        {/* isDR ? <UpcomingDREvent /> : <Schedule /> */}
                    </Col>
                    <Col xs={6} className="ps-2">
                        {/* <NeighbourhoodWatch /> */}
                    </Col>
                </Row>

            </Container>
        </div>
    );
};

export default DashboardPage;
