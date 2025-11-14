import axios from "axios";
import { useState } from "react";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            const response = await axios.post("http://localhost:3000/login", {
                email,
                password
            });
            console.log("Login successful:", response.data);
        }
        catch (error) {
            console.error("Login failed:", error);
        }
    }
    return (
        <div className="w-screen mt-40 flex justify-center items-center">
            <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
                <p className="text-xl font-medium text-center">Login</p>

                <label className="label text-sm">Email</label>
                <input
                    type="email"
                    className="input"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <label className="label text-sm">Password</label>
                <input
                    type="password"
                    className="input"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button className="btn rounded-md mt-4 bg-purple-800" onClick={handleLogin}>Login</button>
            </fieldset>
        </div>
    );
}

export default Login;
