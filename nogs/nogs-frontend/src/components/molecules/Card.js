import { useAuth } from "../AuthContext";


export default function Card() {

    const { user } = useAuth();

    return (
        <div class="credentials-wrapper">
            <h1 class="credentials-heading">Credentials:</h1>
            <div class="credentials-box">
                <div class="credentials-left">
                    <div class="avatar"></div>
                    <div class="rank">
                        <div class="score">1876 🏆</div>
                        <div class="title">Pro Shamer</div>
                    </div>
                </div>
                <div class="credentials-right">
                    <h2 class="username">{user.username}</h2>
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
