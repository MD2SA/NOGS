import { useState } from "react";
import { BAN_URL } from "../../assets/urls/djangoUrls";
import { useAuth } from "../AuthContext";
import ConfirmationModal from "./ConfirmationModal";


export default function Report({ data, goBack }) {

    const { api } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    const ban = async () => {
        try {
            const reponse = await api.post(BAN_URL(data.id));
            goBack()
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <div className="report-detail-container">
                <div className="button-group">
                    <button onClick={goBack}>Back</button>
                    <button className="ban-button" onClick={()=>setIsOpen(true)}>Ban</button>
                </div>
                <h2>{data.username}</h2>
                <h3>{data.reports.length} total reports</h3>
                <h2>Reports description:</h2>
                <div className="report-descriptions">
                    {data.reports.map((report, index) => (
                        <div className="report-description" key={index}>
                            {report.description || "No description"}
                        </div>
                    ))}
                </div>
            </div>
            <ConfirmationModal isOpen={isOpen} close={() => setIsOpen(false)} title={"Ban"} message={`ban ${data.username}`} onConfirmation={ban} />
        </>
    );
}
