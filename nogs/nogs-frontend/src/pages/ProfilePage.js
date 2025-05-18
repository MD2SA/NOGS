import { useEffect } from "react";
import LogoutButton from "../components/atoms/LoggoutButton";
import { useAuth } from "../components/AuthContext";
import AccountManager from "../components/molecules/AccountManager";
import WordStats from "../components/molecules/WordStats";
import Card from "../components/atoms/Card";


export default function ProfilePage() {

    const { me, user } = useAuth();

    useEffect(() => {
        me()
    }, []);

    return (
        <div>
            {user ?
                (
                    <div className="profile-screen">
                        <div className="resultsContainer">
                            <div className="side-container">
                                <Card />
                            </div>
                            <div className="resultsDivider" />
                            <div className="side-container">
                                <WordStats />
                                <LogoutButton />
                            </div>
                        </div>
                    </div>
                )
                : <AccountManager />
            }
        </div>
    );
}
