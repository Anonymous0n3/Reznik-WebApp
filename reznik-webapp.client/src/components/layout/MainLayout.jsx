import { Outlet } from 'react-router-dom';
import Navbar from '../common/Navbar';
import './MainLayout.css';

export default function MainLayout() {
    return (
        <div className="app-container">
            <Navbar />

            {/* Zde se bude měnit obsah podle toho, na jaké jsme URL */}
            <main className="main-content">
                <Outlet />
            </main>

            <footer>
                <p>&copy; 2026 Chovatelská stanice. Všechna práva vyhrazena.</p>
            </footer>
        </div>
    );
}