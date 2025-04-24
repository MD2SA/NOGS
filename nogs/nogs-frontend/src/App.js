import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import './App.css'


export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Home/>}/>
                <Route path='/competition' element={<Home/>}/>
                <Route path='/team' element={<Home/>}/>
                <Route path='/friends' element={<Home/>}/>
                <Route path='/profile' element={<Home/>}/>
            </Routes>
        </BrowserRouter>
    );
}
