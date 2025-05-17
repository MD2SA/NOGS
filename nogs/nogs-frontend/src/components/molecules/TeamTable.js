import { KICK_URL } from "../../assets/urls/djangoUrls";
import Table from "../atoms/Table";
import { useAuth } from "../AuthContext";
import { DateTime } from "luxon";
import { useMemo, useState } from "react";
import ConfirmationModal from "../atoms/ConfirmationModal";

export default function TeamTable({ data, update }) {

    const { api, user } = useAuth();
    const [index, setIndex] = useState(null);

    const isLeader = useMemo(() => {
        const member = data.find(obj => obj.id === user.id)
        return member?.role === 'leader';
    }, [data, user.id]);

    const transformedData = data.map(({ username, role, joined_at }) => ({
        Role: role,
        Username: username,
        'Joined on': DateTime.fromISO(joined_at).toLocaleString(DateTime.DATE_MED)
    }));

    const handleKick = async () => {
        if (index < data.length) {
            const id = data[index]?.id;
            try {
                await api.post(KICK_URL(id))
                update();
            } catch (error) {
                console.log(error);
            }
        }
        setIndex(null)
    }

    const extra = {
        title: "Kick",
        value: "❌",
        onClick: (id) => setIndex(id)
    }


    return (
        <>
            <Table data={transformedData} extra={isLeader ? extra : null} />
            <ConfirmationModal isOpen={index !== null} close={() => setIndex(null)} title={"Kick"} message={`kick ${data[index]?.username}`} onConfirmation={handleKick} />
        </>
    );
}
