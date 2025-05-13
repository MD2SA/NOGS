import { useAuth } from "../AuthContext";
import StatAtom from "../atoms/StatAtom";

export default function WordStats() {

    const { user } = useAuth();

    return (
        <div className="stats-container">
            <StatAtom label={"Best WPM"} value={user.best_wpm || "None"} />
            <StatAtom label={"Avg WPM"} value={user.avg_wpm || "None"} />
            <StatAtom label={"Avg Accuracy"} value={user.avg_accuracy || "None"} />
        </div>
    );
}
