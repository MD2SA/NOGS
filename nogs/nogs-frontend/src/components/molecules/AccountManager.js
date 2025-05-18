import { useState } from "react";
import Login from "../atoms/Login";
import SignUp from "../atoms/SignUp";


export default function AccountManager() {

    const [showLogin, setShowLogin] = useState(false);

    return (
        <>
            {!showLogin ? <Login changeScreen={() => setShowLogin(!showLogin)} /> : <SignUp changeScreen={() => setShowLogin(!showLogin)} />}
        </>
    );
}
