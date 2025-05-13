

export default function StatAtom({label,value}) {

    return (
        <div className="stats-atom">
            <p>{label}</p>
            <p>{value}</p>
        </div>
    );
}
