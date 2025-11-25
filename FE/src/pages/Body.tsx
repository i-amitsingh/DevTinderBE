import { Outlet, useNavigate, useLocation } from "react-router-dom";
import type { ReactElement } from "react";
import { useEffect, useCallback } from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import axios from "axios";
import type { AxiosError } from "axios";
import { BASE_URL } from "../utils/Constants";
import { useDispatch, useSelector } from "react-redux";
import { addUser, removeUser } from "../utils/userSlice";
import type { RootState } from "../utils/appStore";
import type { User } from "../types/User";

const Body = (): ReactElement => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userData = useSelector((store: RootState) => store.user?.user);
    const location = useLocation();

    const fetchUser = useCallback(async (): Promise<void> => {
        try {
            const response = await axios.get<User>(`${BASE_URL}/profile/view`, {
                withCredentials: true,
            });
            dispatch(addUser(response.data));
        } catch (error) {
            const axiosError = error as AxiosError;
            const status = axiosError?.response?.status;
            if (status === 401) {
                dispatch(removeUser());
                localStorage.removeItem("token");
                delete axios.defaults.headers.common["Authorization"];
                navigate("/login");
            } else {
                console.error("Error fetching user:", axiosError);
            }
        }
    }, [dispatch, navigate]);

    useEffect(() => {
        const publicPaths = ["/login", "/signup"];
        if (publicPaths.includes(location.pathname)) {
            return;
        }
        const token = localStorage.getItem("token");
        if (!token) return;
        if (!userData) {
            fetchUser();
        }
    }, [userData, fetchUser, location.pathname]);

    return (
        <div>
            <NavBar />
            <Outlet />
            <Footer />
        </div>
    );
};

export default Body;