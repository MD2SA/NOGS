

export default function ResultAtom({label,value}){
    return(
        <div className="resultAtom">
            <div className="resultAtomLabel">
                {label}
            </div>
            <div className="resultAtomValue">
                {value}
            </div>
        </div>
    );
}
