

export default function Competition({ data }) {
    return (
        <div className="competition-container">
            <div>Required trophies: 1000 <span className="emoji">🏆</span></div>
            <div>Mode: {data.modeOption} {data.mode}</div>
            <div>Lotation: {data.occupied}/{data.lotation} shamers</div>
            <button>Join</button>
        </div>
    );
}
