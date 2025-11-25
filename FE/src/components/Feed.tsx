import axios, { AxiosError } from "axios";
import { BASE_URL } from "../utils/Constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed, removeFeed } from "../utils/feedSlice";
import { useEffect, useCallback } from "react";
import UserCard from "./UserCard";
import type { RootState } from "../utils/appStore";
import type { User } from "../types/User";

function Feed() {
    const feed = useSelector((store: RootState) => store.feed);
    const dispatch = useDispatch();

    const getFeed = useCallback(async () => {
        try {
            const response = await axios.get<User[]>(`${BASE_URL}/user/feed`, {
                withCredentials: true,
            });
            dispatch(addFeed(response.data));
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error("Error fetching feed:", axiosError);
        }
    }, [dispatch]);

    useEffect(() => {
        getFeed();
    }, [getFeed]);

    const handleLike = async (u: User) => {
        try {
            await axios.post(
                `${BASE_URL}/request/send/interested/${u._id}`,
                {},
                { withCredentials: true }
            );

            console.log("Liked:", u.firstName);

            dispatch(removeFeed(u._id));

        } catch (error) {
            console.error("Error liking user:", error);
        }
    };

    const handleDislike = async (u: User) => {
        try {
            await axios.post(
                `${BASE_URL}/request/send/ignore/${u._id}`,
                {},
                { withCredentials: true }
            );

            console.log("Disliked:", u.firstName);

            dispatch(removeFeed(u._id));

        } catch (error) {
            console.error("Error disliking user:", error);
        }
    };

    return (
        <div>
            {feed && feed.length > 0 ? (
                <div className="flex flex-col items-center gap-4 mt-4">
                    <UserCard
                        user={feed[0]}
                        showButtons={true}
                        onLike={handleLike}
                        onDislike={handleDislike}
                    />
                </div>
            ) : (
                <p className="text-center mt-10 text-gray-500">
                    No users available in the feed.
                </p>
            )}
        </div>
    );
}

export default Feed;
