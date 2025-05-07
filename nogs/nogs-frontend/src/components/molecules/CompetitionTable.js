import Table from "../atoms/Table";


export default function CompetitionTable({ data }) {

    const transformedData = data.
        sort((a, b) => b.wpm - a.wpm)
        .map(({ accuracy, wpm, username }, index) => (
            {
                '#': index + 1,
                name: username,
                wpm: wpm,
                accuracy: accuracy,
            }
        ));

    return (
        <Table data={transformedData} />
    );
}

