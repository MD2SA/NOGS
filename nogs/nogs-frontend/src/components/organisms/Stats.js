import { useAuth } from "../AuthContext";
import Card from "../molecules/Card";
import TimeStats from "../molecules/TimeStats";
import WordStats from "../molecules/WordStats";


export default function Stats() {

    return (
        <div>
            <Card />
            <div className="horizontal-divider" />
            <WordStats />
        </div>
    );
}
