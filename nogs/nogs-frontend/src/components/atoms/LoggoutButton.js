import { useState } from "react";
import { useAuth } from "../AuthContext";


export default function LogoutButton() {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const { logout } = useAuth();

    const handleLogout = () => {
        setIsModalVisible(true);
    };

    return (
        <>
            {!isModalVisible ? (
                <button onClick={handleLogout}>
                    Logout
                </button>
            ) : (
                <div>
                    Are you sure you want to logout?
                    <button onClick={logout}>
                        I'm sure
                    </button>
                </div>
            )}
        </>
    );
}
