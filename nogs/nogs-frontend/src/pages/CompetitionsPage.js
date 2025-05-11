import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import "../css/Competition.css";
import Competition from "../components/organisms/Competition";
import CompetitionComposer from "../components/organisms/CompetitionComposer";

export default function CompetitionsPage() {

    const location = useLocation();
    const [shownCompetition, setShownCompetition] = useState();
    const [lastRefresh, setLastRefresh] = useState(-1);

    useEffect(() => {
        if (location.state?.refresh !== lastRefresh) {
            setShownCompetition(null)
            setLastRefresh(location.state?.refresh);
        }
    }, [location.state]);

    return (
        <>
            {!shownCompetition ? (
                <CompetitionComposer setShownCompetition={setShownCompetition} />
            ) : (
                <Competition data={shownCompetition} />
            )}
        </>

    );
}

