import CompetitionComposer from "../components/organisms/CompetitionComposer";
import "../css/Competition.css";


export default function CompetitionPage() {
    return (
        <div>
            <h1 className="title">ACTIVE COMPETITIONS:</h1>
            <CompetitionComposer />
        </div>
    );
}
