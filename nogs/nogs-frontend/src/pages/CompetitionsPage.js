import { useState } from "react";
import Competition from "../components/molecules/Competition";
import "../css/Competition.css";

export default function CompetitionPage() {

    const [competitions, setCompetitions] = useState([
        {
            id: 1,
            league: "BRONZE",
            modeOption: "10",
            mode: "words",
            occupied: "30",
            lotation: "50",
        },
        {
            id: 2,
            league: "BRONZE",
            modeOption: "10",
            mode: "words",
            occupied: "30",
            lotation: "50",
        },
        {
            id: 3,
            league: "BRONZE",
            modeOption: "10",
            mode: "words",
            occupied: "30",
            lotation: "50",
        },
        {
            id: 4,
            league: "BRONZE",
            modeOption: "10",
            mode: "words",
            occupied: "30",
            lotation: "50",
        },
        {
            id: 1,
            league: "BRONZE",
            modeOption: "10",
            mode: "words",
            occupied: "30",
            lotation: "50",
        },
        {
            id: 2,
            league: "BRONZE",
            modeOption: "10",
            mode: "words",
            occupied: "30",
            lotation: "50",
        },
        {
            id: 3,
            league: "BRONZE",
            modeOption: "10",
            mode: "words",
            occupied: "30",
            lotation: "50",
        },
        {
            id: 4,
            league: "BRONZE",
            modeOption: "10",
            mode: "words",
            occupied: "30",
            lotation: "50",
        },
    ]);
    // axios.get(COMPETITIONS);

    return (
        <div className="competitions-container">
            <h1 className="title">ACTIVE COMPETITIONS:</h1>
            <div className="competition-grid">
                {competitions?.length ? (
                    competitions.map((data, index) => (
                        <Competition key={`competition-${index}`} data={data} />
                    ))
                ) : (
                    <p>No competitions available</p>
                )}
            </div>
        </div>
    );
}
