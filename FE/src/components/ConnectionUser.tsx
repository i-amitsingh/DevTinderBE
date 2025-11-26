import type { User } from "../types/User";

type ConnectionUserProps = {
    user: User;
    requestId?: string;
    showButtons?: boolean;
    onAccept?: (requestId?: string) => void;
    onReject?: (requestId?: string) => void;
};

function ConnectionUser({ user, requestId, showButtons, onAccept, onReject }: ConnectionUserProps) {
    return (
        <div>
            <div className="card card-side bg-base-100 shadow-sm p-4 my-auto border-gray-600 border flex items-center justify-between w-96">
                <figure>
                    <img
                        className="h-20 w-20 object-cover rounded-full"
                        src={user?.photoUrl ?? ''}
                        alt={user?.firstName ?? 'User'}
                    />
                </figure>

                <div className="card-body flex-1">
                    <h2 className="card-title">{user?.firstName ?? 'Unknown'} {user?.lastName ?? ''}</h2>
                    <p>{user?.about ?? ''}</p>
                </div>

                {showButtons && (
                    <div className="flex flex-col gap-2">
                        <button
                            className="btn btn-success"
                            onClick={() => onAccept?.(requestId)}
                            disabled={!requestId}
                            title={!requestId ? 'Request id missing' : 'Accept request'}
                        >
                            Accept
                        </button>

                        <button
                            className="btn btn-error"
                            onClick={() => onReject?.(requestId)}
                            disabled={!requestId}
                            title={!requestId ? 'Request id missing' : 'Reject request'}
                        >
                            Reject
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ConnectionUser;
