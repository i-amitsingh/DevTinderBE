import EditProfile from "./EditProfile";
import { useSelector } from "react-redux";
import type { RootState } from "../utils/appStore";


function Profile() {
    const user = useSelector((state: RootState) => state.user.user);
    return (
        user ? <EditProfile user={user} /> : <div>Loading...</div>
    );
}

export default Profile;
