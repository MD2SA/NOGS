import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/molecules/Layout';
import CompetitionsPage from './pages/CompetitionsPage';
import CompetitionPage from './pages/CompetitionPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import Testes from './Testes';


export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Layout />}>
                    <Route path='/' element={<HomePage />} />
                    <Route path='/competitions' element={<CompetitionsPage />} />
                    <Route path='/competitions/competition' element={<CompetitionPage />} />
                    <Route path='/team' element={<HomePage />} />
                    <Route path='/friends' element={<HomePage />} />
                    <Route path='/profile' element={<ProfilePage />} />
                    <Route path='/testes' element={<Testes/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
