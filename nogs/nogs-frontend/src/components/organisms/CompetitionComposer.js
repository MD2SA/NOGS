import axios from "axios";
import { useState } from "react";
import Competition from "../molecules/Competition";

export default function CompetitionComposer() {

    const [competitions, setCompetitions] = useState([
        {
            id: 1,
            league: "BRONZE",
            modeOption: "10",
            mode: "words",
            occupied: "30",
            lotation: "50",
        }
    ]);
    // axios.get(COMPETITIONS);

    return (
        <div className="competition-container">
            {competitions?.length ? (
                competitions.map((data, index) => (
                    <Competition key={`competition-${index}`} data={data} />
                ))
            ) : (
                <p>No competitions available</p>
            )}
        </div>
    );
}
