import type { User } from "../types/User";

interface UserCardProps {
    user: User;
    showButtons?: boolean;                // NEW
    onLike?: (user: User) => void;        // NEW
    onDislike?: (user: User) => void;     // NEW
}

const UserCard = ({ user, showButtons = true, onLike, onDislike }: UserCardProps) => {
    return (
        <div className="card bg-base-300 w-96 shadow-sm">
            <figure>
                <img
                    src={user.photoUrl}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="h-96 w-96 object-cover rounded-t-lg"
                />
            </figure>

            <div className="card-body">
                <h2 className="card-title">
                    {user.firstName} {user.lastName}
                </h2>

                <p>{user.about}</p>

                <div className="card-actions justify-end">
                    <div className="badge badge-outline">{user.gender}</div>
                    <div className="badge badge-outline">{user.age} year old</div>
                </div>

                <div className="card-actions justify-start flex flex-wrap gap-2">
                    {user.skills?.map((skill: string, index: number) => (
                        <div key={index} className="badge badge-primary">
                            {skill}
                        </div>
                    ))}
                </div>

                {showButtons && (
                    <div className="flex justify-center gap-2 card-actions">
                        <button
                            className="btn btn-sm flex-1 bg-green-600 border-0 hover:bg-green-700"
                            onClick={() => onLike && onLike(user)}
                        >
                            Like
                        </button>

                        <button
                            className="btn btn-sm flex-1 bg-red-600 border-0 hover:bg-red-700"
                            onClick={() => onDislike && onDislike(user)}
                        >
                            Dislike
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserCard;
