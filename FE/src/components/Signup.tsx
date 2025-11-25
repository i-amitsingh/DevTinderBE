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

function Signup() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        emailId: "",
        password: "",
        age: "",
        gender: "",
    });

    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    // Handle input change
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Submit signup form
    const handleSignup = async (): Promise<void> => {
        try {
            setIsLoading(true);
            await axios.post(
                `${BASE_URL}/signup`,
                {
                    ...formData,
                    age: Number(formData.age),
                },
                { withCredentials: true }
            );

            // Backend currently returns a success message (string) on signup, and does not set auth cookie.
            // Automatically login the user to set the cookie and get the user object.
            try {
                const loginResponse = await axios.post<{ user: User; token?: string }>(
                    `${BASE_URL}/login`,
                    {
                        emailId: formData.emailId,
                        password: formData.password,
                    },
                    { withCredentials: true }
                );
                const token = loginResponse.data?.token;
                dispatch(addUser(loginResponse.data.user ?? loginResponse.data));
                if (token) {
                    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
                    localStorage.setItem("token", token);
                }
                navigate("/");
            } catch (loginError) {
                // If login after signup fails, take user to login page
                console.warn("Auto-login failed after signup, redirecting to login.", loginError);
                navigate("/login");
            }
            setIsLoading(false);
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error("Signup failed:", axiosError);
            const errData = axiosError?.response?.data;
            const errMsg = typeof errData === 'string' ? errData : JSON.stringify(errData ?? '');
            setError(errMsg || "Signup failed. Please check your details and try again.");
            setIsLoading(false);
        }
    };

    // Form submit handler
    const handleFormSubmit = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        handleSignup();
    };

    return (
        <div className="w-screen mt-20 flex justify-center items-center">
            <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
                <p className="text-xl font-medium text-center">Signup</p>

                <form onSubmit={handleFormSubmit}>
                    {/* First Name */}
                    <label className="label text-sm">First Name</label>
                    <input
                        type="text"
                        className="input"
                        placeholder="First Name"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                    />

                    {/* Last Name */}
                    <label className="label text-sm">Last Name</label>
                    <input
                        type="text"
                        className="input"
                        placeholder="Last Name"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                    />

                    {/* Email */}
                    <label className="label text-sm">Email</label>
                    <input
                        type="email"
                        className="input"
                        placeholder="Email"
                        name="emailId"
                        value={formData.emailId}
                        onChange={handleChange}
                        required
                    />

                    {/* Password */}
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
                        type={showPassword ? "text" : "password"}
                        className="input"
                        placeholder="Password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />

                    {/* Age */}
                    <label className="label text-sm">Age</label>
                    <input
                        type="number"
                        className="input"
                        placeholder="Age"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        min={18}
                        required
                    />

                    {/* Gender */}
                    <label className="label text-sm">Gender</label>
                    <select
                        className="select"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>

                    {/* Error message */}
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="btn w-full rounded-md mt-4 bg-purple-800"
                        disabled={isLoading}
                    >
                        {isLoading ? "Signing up..." : "Signup"}
                    </button>
                </form>
            </fieldset>
        </div>
    );
}

export default Signup;
