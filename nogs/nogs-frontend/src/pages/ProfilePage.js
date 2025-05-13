import { useEffect } from "react";
import LogoutButton from "../components/atoms/LoggoutButton";
import { useAuth } from "../components/AuthContext";
import AccountManager from "../components/molecules/AccountManager";
import WordStats from "../components/molecules/WordStats";
import Card from "../components/molecules/Card";

import "../css/Profile.css"


export default function ProfilePage() {

    const { me, user } = useAuth();

    useEffect(() => {
        me()
    }, []);

    return (
        <div>
            {user ?
                (
                    <>
                        <LogoutButton />
                        <div>
                            <Card />
                            <div className="horizontal-divider" />
                            <WordStats />
                        </div>
                    </>
                )
                : <AccountManager />
            }
        </div>
    );
}
