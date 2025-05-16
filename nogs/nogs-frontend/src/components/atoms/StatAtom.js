

export default function StatAtom({label,value}) {

    return (
        <div className="resultAtom">
            <div className="resultAtom">{label}</div>
            <div className="resultAtomValue">{value}</div>
        </div>
    );
}
