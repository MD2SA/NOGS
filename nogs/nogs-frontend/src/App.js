import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/molecules/Layout';
import Home from './pages/Home';
import Profile from './pages/Profile';


export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Layout />}>
                    <Route path='/' element={<Home />} />
                    <Route path='/competition' element={<Home />} />
                    <Route path='/team' element={<Home />} />
                    <Route path='/friends' element={<Home />} />
                    <Route path='/profile' element={<Profile />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
