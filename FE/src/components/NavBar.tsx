import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { removeUser } from "../utils/userSlice";
import { BASE_URL } from "../utils/Constants";
import axios, { AxiosError } from "axios";
import type { RootState } from "../utils/appStore";

function NavBar() {
    const userState = useSelector((store: RootState) => store.user);
    const user = userState?.user;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axios
                .post(
                    `${BASE_URL}/logout`,
                    {},
                    {
                        withCredentials: true,
                    }
                )
                .then(() => {
                    dispatch(removeUser());
                    // clear token fallback
                    localStorage.removeItem("token");
                    delete axios.defaults.headers.common["Authorization"];
                    navigate("/login");
                });
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error("Logout failed:", axiosError);
        }
    };

    return (
        <div className="navbar bg-base-300 shadow-sm">
            <div className="flex-1">
                <Link to="/" className="btn btn-ghost text-xl">
                    🧑🏼‍💻 DevTinder
                </Link>
            </div>
            {user ? (
                <div className="flex gap-2">
                    <div className="dropdown dropdown-end mx-5 flex">
                        <p className="pr-4 my-auto">Welcome, {user.firstName}</p>
                        <div
                            tabIndex={0}
                            role="button"
                            className="btn btn-ghost btn-circle avatar"
                        >
                            <div className="w-10 rounded-full flex items-center justify-center bg-pink-800 text-white">
                                {user.photoUrl ? (
                                    <img alt="Profile" src={user.photoUrl} />
                                ) : (
                                    <span className="text-xl">
                                        {user.firstName[0].toUpperCase()}
                                    </span>
                                )}
                            </div>
                        </div>
                        <ul
                            tabIndex={-1}
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
                        >
                            <li>
                                <Link className="justify-between" to={"/profile"}>
                                    Profile
                                </Link>
                            </li>
                            <li>
                                <Link to={"/connections"}>Connections</Link>
                            </li>
                            <li>
                                <Link to={"/requests"}>Requests</Link>
                            </li>
                            <li>
                                <a onClick={handleLogout}>Logout</a>
                            </li>
                        </ul>
                    </div>
                </div>
            ) : (
                <div className="flex gap-2">
                    <Link to="/login" className="btn btn-ghost">Login</Link>
                    <Link to="/signup" className="btn btn-primary">Sign up</Link>
                </div>
            )}
        </div>
    );
}

export default NavBar;
