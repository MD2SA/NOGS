import { useEffect } from "react";
import LogoutButton from "../components/atoms/LoggoutButton";
import { useAuth } from "../components/AuthContext";
import AccountManager from "../components/molecules/AccountManager";
import Stats from "../components/organisms/Stats";


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
                        <Stats />
                    </>
                )
                : <AccountManager />
            }
        </div>
    );
}
