import { useEffect, useState } from "react";
import { ME_URL } from "../assets/urls/djangoUrls";
import { useAuth } from "../components/AuthContext";
import Reports from "../components/molecules/Reports";

export default function ReportsPage() {

    const { api } = useAuth();
    const [isStaff, setIsStaff] = useState(false);

    useEffect(() => {
        const askPermissions = async () => {
            try {
                const response = await api.get(ME_URL);
                setIsStaff(response?.data?.is_staff || false);
            } catch (error) {
                setIsStaff(false);
            }
        };
        askPermissions();
    }, []);


    return (
        <>
            {
                isStaff ? (
                    <Reports />
                ) : (
                    <h1 className="error-text">NOT AUTHORIZED</h1>
                )
            }
        </>
    );
}
