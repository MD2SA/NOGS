import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/molecules/Layout';
import HomePage from './pages/HomePage';
import Profile from './pages/Profile';


export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Layout />}>
                    <Route path='/' element={<HomePage />} />
                    <Route path='/competition' element={<HomePage />} />
                    <Route path='/team' element={<HomePage />} />
                    <Route path='/friends' element={<HomePage />} />
                    <Route path='/profile' element={<Profile />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
