import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Home from './pages/Home';
import Dogs from './pages/Dogs';
import Litters from './pages/Litters';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Admin from './pages/AdminDashboard';
import AdminDogs from './pages/AdminDogs';
import AdminLitters from './pages/AdminLitters';
import AdminReservations from './pages/AdminReservations';
import AdminUsers from './pages/AdminUsers'
import AdminGallery from './pages/AdminGallery';
import AdminPuppies from './pages/AdminPuppies';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<Home />} />

                    <Route path="holky" element={<Dogs gender="female" />} />
                    <Route path="kluci" element={<Dogs gender="male" />} />

                    <Route path="aktualni-vrhy" element={<Litters status="current" />} />
                    <Route path="planovane-vrhy" element={<Litters status="planned" />} />

                    <Route path="galerie" element={<Gallery />} />
                    <Route path="kontakt" element={<Contact />} />
                    <Route path="login" element={<Login />} />
                    <Route path="admin" element={<Admin />} />

                    <Route path="admin/dogs" element={<AdminDogs />} />
                    <Route path="admin/litters" element={<AdminLitters />} />
                    <Route path="/admin/reservations" element={<AdminReservations />} />
                    <Route path="/admin/users" element={<AdminUsers />} />
                    <Route path="/admin/gallery" element={<AdminGallery />} />
                    <Route path="/admin/puppies" element={<AdminPuppies />} />

                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;