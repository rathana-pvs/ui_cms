"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setUser } from "@/store/authReducer";
import { setLoading } from "@/store/dialogReducer";

export function useAuth() {
    const [checkingAuth, setCheckingAuth] = useState(true); // new state
    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useDispatch();

    const publicPaths = ["/login", "/register"];

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("token");
            dispatch(setLoading(true));

            if (!token) {
                if (!publicPaths.includes(pathname)) {
                    router.replace("/login");
                }
                dispatch(setLoading(false));
                setCheckingAuth(false);
                return;
            }

            try {
                axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
                const res = await axios.get("/api/proxy/user");
                dispatch(setUser(res.data));

                if (pathname === "/login" || pathname === "/register") {
                    router.replace("/"); // redirect logged-in users from login/register
                }
            } catch (err) {
                localStorage.removeItem("token");
                if (!publicPaths.includes(pathname)) {
                    router.replace("/login");
                }
            } finally {
                dispatch(setLoading(false));
                setCheckingAuth(false);
            }
        };

        checkAuth();
    }, [pathname]);

    return { checkingAuth };
}
