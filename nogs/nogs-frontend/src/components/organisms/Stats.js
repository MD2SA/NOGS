import { useAuth } from "../AuthContext";
import Card from "../molecules/Card";
import TimeStats from "../molecules/TimeStats";
import WordStats from "../molecules/WordStats";


export default function Stats() {

    const { user } = useAuth();

    return (
        <div>
            <Card />
            <TimeStats />
            <WordStats />
        </div>
    );
}
