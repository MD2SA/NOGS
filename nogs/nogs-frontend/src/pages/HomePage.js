import { useState } from "react";
import { SUBMIT_RESULT_URL } from "../assets/urls/djangoUrls";
import Game from "../components/organisms/Game";

export default function HomePage() {

    const [test, setTest] = useState("The quick brown fox jumps over the lazy dog.");

    return (
        <div>
            <Game
                isCompetition={false}
                SubmissionURL={SUBMIT_RESULT_URL}
                targetText={test}
            />
        </div>
    );
}
