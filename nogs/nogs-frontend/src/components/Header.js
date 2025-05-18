import { useNavigate } from 'react-router-dom';

import logo from '../assets/images/logo.png';
import keyboard from '../assets/images/keyboard.png';
import competition from '../assets/images/competition.png';
import team from '../assets/images/team.png';
import friends from '../assets/images/friends.png';
import report from '../assets/images/report.png';
import ProfileIcon from './atoms/ProfileIcon';
import { useAuth } from './AuthContext';

export default function Header() {

    const { user } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="headerContainer">
            <div className="leftHeaderNav">
                <img src={logo} onClick={() => navigate('/', { replace: true, state: { refresh: Date.now() } })} />
                <img src={keyboard} onClick={() => navigate('/', { replace: true, state: { refresh: Date.now() } })} />
                <img src={competition} onClick={() => navigate('/competitions', { replace: true, state: { refresh: Date.now() } })} />
                <img src={team} onClick={() => navigate('/team')} />
                <img src={friends} onClick={() => navigate('/friends')} />
                {user && user.is_staff && <img src={report} onClick={() => navigate('/reports')} />}
            </div>
            <div className="rightHeaderNav">
                <ProfileIcon />
            </div>
        </div>
    );
}
