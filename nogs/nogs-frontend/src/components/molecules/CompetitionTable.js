import { useState } from "react";
import { REPORT_URL } from "../../assets/urls/djangoUrls";
import ConfirmationModal from "../atoms/ConfirmationModal";
import Table from "../atoms/Table";
import { useAuth } from "../AuthContext";


export default function CompetitionTable({ data }) {

    const { api } = useAuth();
    const [index, setIndex] = useState(null);

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

    const handleReport = async () => {
        if (index < data.length) {
            try {
                const user = data[index].user;
                await api.post(REPORT_URL, { user: user });
            } catch (error) {
                console.log(error);
            }
        }
        setIndex(null);
    }

    const extra = {
        title: "Report",
        value: "⚠️",
        onClick: (id) => setIndex(id)
    }

    return (
        <>
            <Table data={transformedData} extra={extra} />
            <ConfirmationModal isOpen={index !== null} close={() => setIndex(null)} title={"Report"} message={`report ${data[index]?.username}`} onConfirmation={handleReport} />
        </>
    );
}

