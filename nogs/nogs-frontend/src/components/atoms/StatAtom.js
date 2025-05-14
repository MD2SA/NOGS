

export default function StatAtom({label,value}) {

    return (
        <div className="stats-atom">
            <div className="stat-atom-label">{label}</div>
            <div className="stat-atom-value">{value}</div>
        </div>
    );
}
