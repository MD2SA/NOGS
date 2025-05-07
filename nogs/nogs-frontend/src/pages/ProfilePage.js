import LogoutButton from "../components/atoms/LoggoutButton";
import { useAuth } from "../components/AuthContext";
import AccountManager from "../components/molecules/AccountManager";
import Stats from "../components/organisms/Stats";


export default function ProfilePage() {

    const { user } = useAuth();

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
