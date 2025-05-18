import { useState } from "react";
import { REPORT_URL } from "../../assets/urls/djangoUrls";
import ConfirmationModal from "../atoms/ConfirmationModal";
import ReportModal from "../atoms/ReportModal";
import Table from "../atoms/Table";
import { useAuth } from "../AuthContext";


export default function CompetitionTable({ data }) {

    const [user, setUser] = useState(null);

    const transformedData = data.
        sort((a, b) => b.wpm - a.wpm)
        .map(({ accuracy, wpm, username, tries }, index) => (
            {
                '#': index + 1,
                name: username,
                wpm: wpm,
                accuracy: accuracy,
                ...(tries !== null && { 'tries left': tries }),

            }
        ));

    const handleReport = async (index) => {
        if (index < data.length) {
            try {
                const user = data[index];
                setUser(user);
            } catch (error) {
                setUser(null);
            }
        }
    }

    const extra = {
        title: "Report",
        value: "⚠️",
        onClick: (index) => handleReport(index)
    }

    return (
        <>
            <Table data={transformedData} extra={extra} />
            <ReportModal isOpen={user} userData={user} onClose={() => setUser(null)} />
        </>
    );
}

