import React from 'react';
import './DashboardPage.scss';
import Header from '../../components/Header/Header.jsx';

const programTitles = {
    DP: 'Dynamic Pricing Dashboard',
    DR: 'Demand Response Dashboard',
};

const DashboardPage = () => {
    const programType = sessionStorage.getItem('programType');
    const pageTitle = programTitles[programType] ?? 'Dashboard';

    return (
        <div className="dashboard-layout">
            <Header />

            <div className="dashboard-body">
                <aside className="dashboard-sidebar">
                    <nav className="dashboard-sidebar__nav">
                        <ul>
                            <li className="dashboard-sidebar__nav-item dashboard-sidebar__nav-item--active">
                                Dashboard
                            </li>
                        </ul>
                    </nav>
                </aside>

                <main className="dashboard-main">
                    <h1 className="dashboard-main__title">{pageTitle}</h1>

                    <div className="dashboard-main__content">
                        {/* Dashboard components will be placed here */}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardPage;

