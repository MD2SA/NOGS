import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import CompetitionsPage from './pages/CompetitionsPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import FriendsPage from './pages/FriendsPage';
import MessagePage from './pages/MessagePage';
import TeamsPage from './pages/TeamsPage';
import ReportsPage from './pages/ReportsPage';
import NotFound from './pages/NotFoundPage';

export default function App() {

    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Layout />}>
                    <Route path='/' element={<HomePage />} />
                    <Route path='/competitions' element={<CompetitionsPage />} />
                    <Route path='/team' element={<TeamsPage />} />
                    <Route path='/profile' element={<ProfilePage />} />
                    <Route path="/friends" element={<FriendsPage />} />
                    <Route path="/messages/:friendId" element={<MessagePage />} />
                    <Route path='/reports' element={<ReportsPage />} />
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
