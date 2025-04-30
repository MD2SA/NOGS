import Table from "../components/molecules/Table";
import "../css/Competition.css";


export default function CompetitionPage() {
    return (
        <div>
            <h1 className="title">TIME TO LOCK IN</h1>
            <div>
                <div className="competition-container">
                    <Table />
                </div>
                <div className="resultsDivider" />
                <button className="resultsButton" >
                    Play
                </button>
            </div>
        </div>
    );
}
