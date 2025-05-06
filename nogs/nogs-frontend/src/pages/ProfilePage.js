import { useState } from "react";
import { useAuth } from "../components/AuthContext";
import AccountManager from "../components/molecules/AccountManager";
import Login from "../components/molecules/Login";


export default function ProfilePage() {

    const { user } = useAuth();


    return (
        <div>
            <AccountManager/>
        </div>
    );
}
