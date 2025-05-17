import { useAuth } from "../AuthContext";
import ResultAtom from "../atoms/ResultAtom";

export default function WordStats() {

    const { user } = useAuth();

    return (
        <div className="resultAtomsContainer">
            <ResultAtom label={"Best WPM"} value={user.best_wpm || "None"} />
            <ResultAtom label={"Avg WPM"} value={user.avg_wpm || "None"} />
            <ResultAtom label={"Avg Accuracy"} value={user.avg_accuracy || "None"} />
        </div>
    );
}
