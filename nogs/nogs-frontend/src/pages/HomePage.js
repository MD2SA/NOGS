import { SUBMIT_RESULT_URL } from "../assets/urls/djangoUrls";
import Game from "../components/organisms/Game";

export default function HomePage() {

    return (
        <div>
            <Game
                isCompetition={false}
                SubmissionURL={SUBMIT_RESULT_URL}
                targetText={ "The quick brown fox jumps over the lazy dog."} //default text
            />
        </div>
    );
}
