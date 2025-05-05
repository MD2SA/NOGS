import { useState } from "react";
import Login from "./Login";
import SignUp from "./SignUp";


export default function AccountManager() {

    const [showLogin, setShowLogin] = useState(false);

    return (
        <>
            {!showLogin ? <Login changeScreen={() => setShowLogin(!showLogin)} /> : <SignUp changeScreen={() => setShowLogin(!showLogin)} />}
        </>
    );
}
