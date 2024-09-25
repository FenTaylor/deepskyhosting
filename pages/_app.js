import Header from "../components/Header";
import Footer from "../components/Footer";
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
            <Component {...pageProps} user={user} setUser={setUser} />
            <Footer />
        </>
    );
}

export default MyApp;
