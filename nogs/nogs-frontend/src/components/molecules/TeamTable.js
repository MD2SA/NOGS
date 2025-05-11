import Table from "../atoms/Table";

export default function TeamTable({ data }) {
    const transformedData = data.map(({ name, description }, index) => ({
        '#': index + 1,
        name: name,
        description: description.length > 50 ? description.slice(0, 50) + '...' : description
    }));

    return <Table data={transformedData} />;
}