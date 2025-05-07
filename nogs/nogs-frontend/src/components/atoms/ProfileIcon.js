import { useAuth } from "../AuthContext";
import userImg from '../../assets/images/user.png';
import { useNavigate } from "react-router-dom";


export default function ProfileIcon() {

    const { user } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="profile-icon">
            {user && user.username}
            <img src={userImg} onClick={() => navigate('/profile')} />
        </div>
    );
}
