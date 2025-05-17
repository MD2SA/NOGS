import { REPORT_URL } from "../../assets/urls/djangoUrls";
import Table from "../atoms/Table";
import { useAuth } from "../AuthContext";


export default function CompetitionTable({ data }) {

    const { api } = useAuth();

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
        if (index >= data.length) return;
        try {
            const user = data[index].user;
            await api.post(REPORT_URL, { user: user });
        } catch (error) {
            console.log(error);
        }

    }

    const extra = {
        title: "Report",
        value: "⚠️",
        onClick: handleReport
    }

    return (
        <Table data={transformedData} extra={extra} />
    );
}

