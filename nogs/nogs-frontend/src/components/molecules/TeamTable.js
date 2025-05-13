import Table from "../atoms/Table";

export default function TeamTable({ data }) {
    console.log(data);
    const transformedData = data.map(({ id, username }, index) => ({
        '#': index + 1,
        Username: username,
        ID: id
    }));

    return <Table data={transformedData} />;
}
