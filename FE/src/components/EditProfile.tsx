import axios, { AxiosError } from "axios";
import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { BASE_URL } from "../utils/Constants";
import UserCard from "./UserCard";

function EditProfile({ user }) {
    const [firstName, setFirstName] = useState<string>(user.firstName);
    const [lastName, setLastName] = useState<string>(user.lastName);
    const [about, setAbout] = useState<string>(user.about);
    const [age, setAge] = useState<number>(user.age);
    const [gender, setGender] = useState<string>(user.gender);
    const [photoUrl, setPhotoUrl] = useState<string>(user.photoUrl);
    const [error, setError] = useState<string>("");
    const [showToast, setShowToast] = useState<boolean>(false);
    const dispatch = useDispatch();

    const saveProfile = async () => {
        try {
            const response = await axios.patch(
                `${BASE_URL}/profile/edit`,
                {
                    firstName,
                    lastName,
                    about,
                    age,
                    gender,
                    photoUrl,
                },
                {
                    withCredentials: true,
                }

            );
            dispatch(addUser(response.data.data));
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        } catch (error) {
            setError("Failed to save profile. Please try again.");
            const axiosError = error as AxiosError;
            console.error("Save profile failed:", axiosError);
        }
    };

    const handleFirstNameChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setFirstName(e.target.value);
    };

    const handleLastNameChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setLastName(e.target.value);
    };

    const handleAboutChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
        setAbout(e.target.value);
    };

    const handleAgeChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setAge(Number(e.target.value));
    };

    const handleGenderChange = (e: ChangeEvent<HTMLSelectElement>): void => {
        setGender(e.target.value);
    };

    const handlePhotoUrlChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setPhotoUrl(e.target.value);
    };

    const handleFormSubmit = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        saveProfile();
    };

    return (
        <div>
            <div className="flex justify-center m-10">
                <div className="mx-10 flex justify-center items-center">
                    <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
                        <p className="text-xl font-medium text-center">Login</p>
                        <form onSubmit={handleFormSubmit}>
                            <label className="label text-sm">Full Name</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    className="input"
                                    placeholder="First Name"
                                    value={firstName}
                                    onChange={handleFirstNameChange}
                                />
                                <input
                                    type="text"
                                    className="input"
                                    placeholder="Last Name"
                                    value={lastName}
                                    onChange={handleLastNameChange}
                                />
                            </div>

                            <label className="label text-sm">Age</label>
                            <input
                                type="number"
                                className="input w-full"
                                placeholder="Age"
                                value={age}
                                onChange={handleAgeChange}
                            />

                            <label className="label text-sm">Gender</label>
                            <select
                                className="select select-bordered w-full"
                                value={gender}
                                onChange={handleGenderChange}
                            >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>

                            <label className="label text-sm">Photo URL</label>
                            <input
                                type="text"
                                className="input w-full"
                                placeholder="Photo URL"
                                value={photoUrl}
                                onChange={handlePhotoUrlChange}
                            />

                            <label className="label text-sm">About</label>
                            <textarea
                                type="textarea"
                                className="input w-full h-36"
                                placeholder="About"
                                value={about}
                                onChange={handleAboutChange}
                            />
                            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                            <button
                                type="submit"
                                className="btn w-full rounded-md mt-4 bg-purple-800"
                            >
                                Save Profile
                            </button>
                        </form>
                    </fieldset>
                </div >

                <UserCard user={{ firstName, lastName, age, gender, photoUrl, about }} showButtons={false} />
            </div>
            <div className="toast toast-top toast-center">
                {showToast && (
                    <div className="alert alert-success">
                        <span>Profile Saved successfully.</span>
                    </div>
                )}
            </div>
        </div>
    );
}

export default EditProfile;
