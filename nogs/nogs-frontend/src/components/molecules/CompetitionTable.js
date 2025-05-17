import Table from "../atoms/Table";


export default function CompetitionTable({ data }) {

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

    const handleReport = (index) => {
        console.log(index)
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

