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
                        <div className="score">1876 🏆</div>
                        <div className="title">Pro Shamer</div>
                    </div>
                </div>
                <div className="credentials-right">
                    <h2 className="username">{user.username}</h2>
                    <p><strong>Birth:</strong>{user.date_joined}</p>
                    <p><strong>Team:</strong> DevNOGS</p>
                    <p><strong>Phrases written:</strong> 17497</p>
                    <p><strong>Best Leaderboard:</strong> 25th</p>
                </div>
            </div>
        </div>
    );
}
// <div class="credentials-container">
//     <div class="credentials-card">
//         <h1 class="credentials-title">Credentials</h1>
//         <div class="credentials-content">
//             <h2 class="credentials-username">{user.username}</h2>
//             <p>Birth: {user.date_joined}</p>
//             <p>Team: {user.team || "None"}</p>
//         </div>
//     </div>
// </div>
