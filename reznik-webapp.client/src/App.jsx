import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Home from './pages/Home';
import Dogs from './pages/Dogs';
import Litters from './pages/Litters';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Layout obaluje všechny veřejné stránky */}
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<Home />} />

                    {/* Stránku Dogs znovupoužijeme, jen jí předáme jinou prop */}
                    <Route path="holky" element={<Dogs gender="female" />} />
                    <Route path="kluci" element={<Dogs gender="male" />} />

                    <Route path="aktualni-vrhy" element={<Litters status="current" />} />
                    <Route path="planovane-vrhy" element={<Litters status="planned" />} />

                    <Route path="galerie" element={<Gallery />} />
                    <Route path="kontakt" element={<Contact />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;