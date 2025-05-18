import { DateTime } from "luxon";
import { useAuth } from "../AuthContext";


export default function Card() {

    const { user } = useAuth();

    return (
        <div className="credentials-wrapper">
            <h1 className="credentials-heading">Credentials:</h1>
            <div className="credentials-box">
                <div className="credentials-left">
                    <div className="avatar"></div>
                    <div className="rank">
                        <p>Pro Shamer</p>
                    </div>
                </div>
                <div className="credentials-right">
                    <h2 className="username">{user.username}</h2>
                    <p><strong>Birth:</strong>{DateTime.fromISO(user.date_joined).toLocaleString(DateTime.DATE_SHORT)}</p>
                    <p><strong>Team:</strong> {user.team || "None"}</p>
                    <p><strong>Phrases:</strong> {user.total_games || 0}</p>
                    <p><strong>Time played:</strong> {user.total_time_played || 0} s</p>
                </div>
            </div>
        </div>
    );
}
