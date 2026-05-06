import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import { getUserProfile } from '../../clients/BackendConnector';
import Header from '../../components/Header/Header';
import DPAccountSummary from '../../components/DPAccountSummary/DPAccountSummary';
import DRAccountSummary from '../../components/DRAccountSummary/DRAccountSummary';
import Rewards from '../../components/Rewards/Rewards';
import ProgramDetails from '../../components/ProgramDetails/ProgramDetails';
import UpcomingDREvent from '../../components/UpcomingDREvent/UpcomingDREvent';
import './DashboardPage.scss';
import CurrentSchedule from "../../components/CurrentSchedule/CurrentSchedule.jsx";
import NeighbourhoodWatch from '../../components/NeighbourhoodWatch/NeighbourhoodWatch';

const DashboardPage = () => {
    const [programType, setProgramType] = useState(null);
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

                sessionStorage.setItem('utilityId', profile.utility.utilityId);
                sessionStorage.setItem('programType', profile.utility.programType);

                setProgramType(profile.utility.programType);
            } catch {
                // Individual components handle their own errors.
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

    const dashboardTitle = programType === 'DR'
        ? 'Demand Response Dashboard'
        : programType === 'DP'
            ? 'Dynamic Pricing Dashboard'
            : null;

    return (
        <div className="dashboard-page">
            <Header />

            <Container fluid className="dashboard-container py-4">

                {dashboardTitle && (
                    <h1 className="dashboard-title text-center mb-3">
                        {dashboardTitle}
                    </h1>
                )}

                {/* ── Activity Summary ── */}
                <Row className="mb-3">
                    <Col xs={12}>
                        {programType === 'DP' && <DPAccountSummary />}
                        {programType === 'DR' && <DRAccountSummary />}
                    </Col>
                </Row>

                {/* ── Rewards | Program Details ── */}
                <Row className="mb-3">
                    <Col xs={6} className="pe-2">
                        <Rewards programType={programType} />
                    </Col>
                    <Col xs={6} className="ps-2">
                        <ProgramDetails />
                    </Col>
                </Row>

                {/* ── Schedule | Neighbourhood Watch ── */}
                <Row className="mb-3">
                    <Col xs={6} className="pe-2">
                        {programType === 'DP' && <CurrentSchedule />}
                        {programType === 'DR' && <UpcomingDREvent />}
                    </Col>
                    <Col xs={6} className="ps-2">
                        <NeighbourhoodWatch programType={programType} />
                    </Col>
                </Row>


            </Container>
        </div>
    );
};

export default DashboardPage;
