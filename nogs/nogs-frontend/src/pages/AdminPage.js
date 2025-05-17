import { useAuth } from "../components/AuthContext";
import CreateCompetition from "../components/atoms/CreateCompetition";

export default function AdminPage() {

    const { api, user } = useAuth();


    return (
        <>
            {
                user.is_staff &&
                <div>
                    <button>Manage Competitions</button>
                    <button>Manage Teams</button>
                    <button>Manage Users</button>
                </div>
            }
        </>
    );
}
