import { useNavigate } from "react-router-dom";
import { BAN_URL } from "../../assets/urls/djangoUrls";
import { useAuth } from "../AuthContext";


export default function Report({ data, goBack }) {

    const { api } = useAuth();
    const navigate = useNavigate();

    const ban = async () => {
        try {
            const reponse = await api.post(BAN_URL(data.id));
        } catch (error) {
        }
    }

    return (
        <div className="report-detail-container">
            <div className="button-group">
                <button onClick={goBack}>Back</button>
                <button className="ban-button" onClick={ban}>Ban</button>
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
    );
}
