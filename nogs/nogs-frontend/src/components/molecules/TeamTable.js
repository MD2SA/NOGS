import Table from "../atoms/Table";

export default function TeamTable({ data }) {
    console.log(data);
    const transformedData = data.map(({ id, username }, index) => ({
        'Membro nº': index + 1,
        Username: username
    }));

    return <Table data={transformedData} />;
}
