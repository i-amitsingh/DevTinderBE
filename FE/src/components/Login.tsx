import axios from "axios";
import type { AxiosError } from "axios";
import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../utils/appStore";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/Constants";
import { Eye, EyeOff } from "lucide-react";
import type { User } from "../types/User";

function Login() {
    const [emailId, setEmailId] = useState<string>("amit@gmail.com");
    const [password, setPassword] = useState<string>("Amit@123");
    const [error, setError] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const handleLogin = async (): Promise<void> => {
        try {
            const response = await axios.post<{ user: User; token?: string }>(
                `${BASE_URL}/login`,
                {
                    emailId,
                    password,
                },
                {
                    withCredentials: true,
                }
            );
            const token = response.data?.token;
            dispatch(addUser(response.data.user ?? response.data));
            if (token) {
                axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
                localStorage.setItem("token", token);
            }
            navigate("/");
        } catch (error) {
            const axiosError = error as AxiosError;
            const serverMessage = axiosError?.response?.data;
            const message = typeof serverMessage === "string" ? serverMessage : axiosError?.message ?? "Login failed. Please check your credentials and try again.";
            setError(message);
            console.error("Login failed:", axiosError);
        }
    };

    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setEmailId(e.target.value);
    };

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setPassword(e.target.value);
    };

    const handleFormSubmit = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        handleLogin();
    };

    return (
        <div className="w-screen mt-40 flex justify-center items-center">
            <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
                <p className="text-xl font-medium text-center">Login</p>

                <form onSubmit={handleFormSubmit}>
                    <label className="label text-sm">Email</label>
                    <input
                        type="email"
                        className="input"
                        placeholder="Email"
                        value={emailId}
                        onChange={handleEmailChange}
                    />

                    <label className="label text-sm">
                        Password
                        <span
                            className="text-xs text-gray-500 cursor-pointer ml-1"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff /> : <Eye />}
                        </span>
                    </label>
                    <input
                        className="input"
                        placeholder="Password"
                        value={password}
                        onChange={handlePasswordChange}
                        type={showPassword ? "text" : "password"}
                    />
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    <button
                        type="submit"
                        className="btn w-full rounded-md mt-4 bg-purple-800"
                    >
                        Login
                    </button>
                    <p className="text-center text-sm mt-3">
                        Don’t have an account?{" "}
                        <span
                            className="text-purple-700 cursor-pointer hover:underline"
                            onClick={() => navigate("/signup")}
                        >
                            Sign up
                        </span>
                    </p>
                </form>
            </fieldset>
        </div>
    );
}

export default Login;
