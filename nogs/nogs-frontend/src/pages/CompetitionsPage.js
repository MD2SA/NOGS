import { useEffect, useState } from "react";
import { COMPETITIONS_URL } from "../assets/urls/djangoUrls";
import CompetitionDetail from "../components/molecules/CompetitionDetail";
import "../css/Competition.css";
import axios from "axios";

export default function CompetitionPage() {

    const [competitions, setCompetitions] = useState();
    const [message, setMessage] = useState('');
    const loadCompetitions = () => {
        axios.get(COMPETITIONS_URL)
            .then(response => setCompetitions(response.data))
            .catch(error => setMessage("No competitions available"));
    };

    useEffect(() => {
        setMessage("Loading...");
        loadCompetitions();
    }, []);

    console.log(competitions);

    return (
        <div className="competitions-container">
            <h1 className="title">ACTIVE COMPETITIONS:</h1>
            <div className="competition-grid">
                {competitions?.length ? (
                    competitions.map((data, index) => (
                        <CompetitionDetail key={`competition-${index}`} data={data} />
                    ))
                ) : (
                    <h2 className="sub-title">{message}</h2>
                )}
            </div>
        </div>
    );
}

    //     {
    //         id: 1,
    //         league: "BRONZE",
    //         modeOption: "10",
    //         mode: "words",
    //         occupied: "30",
    //         lotation: "50",
    //     },
    //     {
    //         id: 2,
    //         league: "BRONZE",
    //         modeOption: "10",
    //         mode: "words",
    //         occupied: "30",
    //         lotation: "50",
    //     },
    //     {
    //         id: 3,
    //         league: "BRONZE",
    //         modeOption: "10",
    //         mode: "words",
    //         occupied: "30",
    //         lotation: "50",
    //     },
    //     {
    //         id: 4,
    //         league: "BRONZE",
    //         modeOption: "10",
    //         mode: "words",
    //         occupied: "30",
    //         lotation: "50",
    //     },
    //     {
    //         id: 1,
    //         league: "BRONZE",
    //         modeOption: "10",
    //         mode: "words",
    //         occupied: "30",
    //         lotation: "50",
    //     },
    //     {
    //         id: 2,
    //         league: "BRONZE",
    //         modeOption: "10",
    //         mode: "words",
    //         occupied: "30",
    //         lotation: "50",
    //     },
    //     {
    //         id: 3,
    //         league: "BRONZE",
    //         modeOption: "10",
    //         mode: "words",
    //         occupied: "30",
    //         lotation: "50",
    //     },
    //     {
    //         id: 4,
    //         league: "BRONZE",
    //         modeOption: "10",
    //         mode: "words",
    //         occupied: "30",
    //         lotation: "50",
    //     },
    // ]);
