import { useAuth } from "../AuthContext";

export default function WordStats() {

    const { user } = useAuth();

    console.log(user);
    return (
        <div className="stats-container">

        </div>
    );
}
