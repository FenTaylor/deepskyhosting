import Header from "../components/Header";
import { useState, useEffect } from "react";
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }) {
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const loggedUser = localStorage.getItem("user");
        if (loggedUser) {
            setUser(JSON.parse(loggedUser));
        }
    }, []);

    return (
        <>
            <Header user={user} />
            <Component {...pageProps} setUser={setUser} />
        </>
    );
}

export default MyApp;
