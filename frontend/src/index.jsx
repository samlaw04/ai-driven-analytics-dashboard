import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router,Route, Routes} from "react-router-dom";
import './index.scss'
import 'bootstrap/dist/css/bootstrap.min.css'
import LoginPage from "./pages/LoginPage/LoginPage.jsx";


createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage/>}/>
            </Routes>
        </Router>
    </StrictMode>
)
