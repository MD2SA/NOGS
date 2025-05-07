import { useAuth } from "../AuthContext";


export default function Card() {

    const { user } = useAuth();

    return (
        <div style={{ height: 100, width: 100, backgroundColor: "red" }}>
            <h1 className="title">Credentials</h1>
            <h2 className="sub-title"> {user.username} </h2>
            Nogs birth: {user.date_joined}
            Team: {user.team || "Lonely"}
        </div>
    );
}
