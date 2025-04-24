import { useNavigate } from 'react-router-dom';

import '../../css/Header.css';
import logo from '../../assets/images/logo.png';
import keyboard from '../../assets/images/keyboard.png';
import competition from '../../assets/images/competition.png';
import team from '../../assets/images/team.png';
import friends from '../../assets/images/friends.png';
import user from '../../assets/images/user.png';

export default function Header() {

    const navigate = useNavigate();

    return(
        <div className="headerContainer">
            <div className="leftHeaderNav">
                <img src={logo} onClick={()=>navigate('/')}/>
                <img src={keyboard} onClick={()=>navigate('/')}/>
                <img src={competition} onClick={()=>navigate('/competition')}/>
                <img src={team} onClick={()=>navigate('/team')}/>
                <img src={friends} onClick={()=>navigate('/friends')}/>
            </div>
            <div className="rightHeaderNav">
                <img src={user} onClick={()=>navigate('/profile')}/>
            </div>
        </div>
    );
}
