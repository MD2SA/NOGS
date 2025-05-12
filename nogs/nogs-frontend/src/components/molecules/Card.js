import { useAuth } from "../AuthContext";
import { DateTime } from "luxon";
import { ME_URL } from "../../assets/urls/djangoUrls";
import { useEffect, useState } from "react";


export default function Card() {

    const { api, user } = useAuth();
    console.log("USER", user);

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
                    <p><strong>Birth:</strong>{DateTime.fromISO(user.date_joined).toLocaleString(DateTime.DATE_SHORT)}</p>
                    <p><strong>Team:</strong> {user.team || "None" }</p>
                    <p><strong>Phrases written:</strong> {user.total_games_played}</p>
                    <p><strong>Time played:</strong> {user.total_time_played} s</p>

                </div>
            </div>
        </div>
    );
}
