import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/molecules/Layout';
import CompetitionsPage from './pages/CompetitionsPage';
import CompetitionPage from './pages/CompetitionPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import FriendsPage from './pages/FriendsPage';
import MessagePage from './pages/MessagePage';


export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Layout />}>
                    <Route path='/' element={<HomePage />} />
                    <Route path='/competitions' element={<CompetitionsPage />} />
                    <Route path='/competitions/competition' element={<CompetitionPage />} />
                    <Route path='/team' element={<HomePage />} />
                    <Route path='/profile' element={<ProfilePage />} />
                    <Route path="/friends" element={<FriendsPage />} />
                    <Route path="/messages/:friendId" element={<MessagePage />} />

                </Route>
            </Routes>
        </BrowserRouter>
    );
}
