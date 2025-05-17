import { KICK_URL } from "../../assets/urls/djangoUrls";
import Table from "../atoms/Table";
import { useAuth } from "../AuthContext";
import { DateTime } from "luxon";
import { useMemo } from "react";

export default function TeamTable({ data, update }) {

    const { api, user } = useAuth();

    const isLeader = useMemo(() => {
        const member = data.find(obj => obj.id === user.id)
        return member?.role === 'leader';
    }, [data, user.id]);

    const transformedData = data.map(({ _, username, role, joined_at }, index) => ({
        Role: role,
        Username: username,
        'Joined at': DateTime.fromISO(joined_at).toLocaleString(DateTime.DATE_MED)
    }));

    const handleKick = async (index) => {
        if (index >= data.length) return;
        const id = data[index]?.id;
        try {
            await api.post(KICK_URL(id))
            update();
        } catch (error) {
            console.log(error);
        }
    }

    const extra = {
        title: "Kick",
        value: "❌",
        onClick: handleKick
    }


    return <Table data={transformedData} extra={isLeader ? extra : null} />;
}
