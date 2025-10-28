"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setUser } from "@/store/authReducer";
import { setLoading } from "@/store/dialogReducer";

export function useAuth() {
    const [loading, setLoadingState] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useDispatch();

    const publicPaths = ["/login", "/register"];

    useEffect(() => {
        const token = localStorage.getItem("token");

        const checkAuth = async () => {
            if (!token) {
                if (!publicPaths.includes(pathname)) {
                    router.replace("/login");
                }
                setLoadingState(false);
                return;
            }

            try {
                axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
                const res = await axios.get("/api/proxy/user");

                dispatch(setUser(res.data));
                router.replace("/");

            } catch (err) {
                console.warn("Auth check failed:", err?.message);
                localStorage.removeItem("token");
                if (!publicPaths.includes(pathname)) {
                    router.replace("/login");
                }
                // dispatch(setLoading(false));
                // setLoadingState(false);
            }finally {
                setLoadingState(false);
            }
        };

        checkAuth();


    }, [pathname]);

    return { loading };
}
