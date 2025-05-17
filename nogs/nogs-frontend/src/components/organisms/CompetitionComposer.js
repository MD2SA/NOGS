import { COMPETITIONS_URL } from "../../assets/urls/djangoUrls";
import { useEffect, useState } from "react";
import CreateCompetition from "../atoms/CreateCompetition";
import CompetitionDetail from "../molecules/CompetitionDetail";
import { useAuth } from "../AuthContext";


export default function CompetitionComposer({ setShownCompetition }) {

    const [competitions, setCompetitions] = useState();
    const [message, setMessage] = useState('');
    const { api } = useAuth();

    const loadCompetitions = () => {
        api.get(COMPETITIONS_URL)
            .then(response => {
                setCompetitions(response.data);
                if (response.data.length > 0)
                    setMessage("");
            })
            .catch(error => setMessage("No competitions available"));
    };

    useEffect(() => {
        setMessage("Loading...");
        loadCompetitions();
    }, []);

    const { user } = useAuth();

    return (
        <div className="composer-container">
            <h1 className="title">ACTIVE COMPETITIONS:</h1>
            {user?.is_staff && <CreateCompetition onCreate={loadCompetitions} />}
            <div className="composer-grid">
                {(competitions?.length) ? (
                    competitions.map((data, index) => (
                        <CompetitionDetail key={`competition-${index}`} data={data} setShownCompetition={setShownCompetition} />
                    ))
                ) : (
                    <h2 className="sub-title">{message}</h2>
                )}
            </div>
        </div>
    );
}
