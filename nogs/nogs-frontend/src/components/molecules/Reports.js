import { useEffect, useState } from "react";
import { REPORT_URL } from "../../assets/urls/djangoUrls";
import Report from "../atoms/Report";
import { useAuth } from "../AuthContext";
import "../../css/Reports.css"


export default function Reports() {

    const { api } = useAuth();
    const [reports, setReports] = useState();
    const [shownReport, setShownReport] = useState(false);

    const loadReports = async () => {
        try {
            const response = await api.get(REPORT_URL);
            const filteredData = response.data.filter(data => data.reports.length > 0);
            setReports(filteredData);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        loadReports();
    }, [shownReport]);

    return (
        <>
            {reports?.length>0 ? (
                !shownReport ? (
                    <div className="reportsMasterContainer">
                        <h2 className="sub-title">{reports.length} users reported</h2>
                        <div className="reportsGrid">
                            {reports.map((report, index) => (
                                <div className="reportCard" key={index}>
                                    <div className="reportField">
                                        <span className="reportLabel">Username:</span>
                                        <span className="reportValue">{report.username}</span>
                                    </div>
                                    <div className="reportField">
                                        <span className="reportLabel">Total reports:</span>
                                        <span className="reportValue">{report.reports.length}</span>
                                    </div>
                                    <button onClick={() => setShownReport(report)}>Analyse</button>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <Report data={shownReport} goBack={() => setShownReport(null)} />
                )
            ) : (
                <div className="noReportsHero">No reports yet, amazing</div>
            )}
        </>
    );
}
