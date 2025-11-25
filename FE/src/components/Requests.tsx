import axios from 'axios';
import { useEffect, useCallback } from 'react';
import { BASE_URL } from '../utils/Constants';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../utils/appStore';
import type { Request } from '../types/Request';
import type { AppDispatch } from '../utils/appStore';
import { addRequests } from '../utils/requestsSlice';
import ConnectionUser from './ConnectionUser';

const Requests = () => {
    const requests = useSelector((state: RootState) => state.requests);
    const user = useSelector((state: RootState) => state.user?.user);
    const dispatch = useDispatch<AppDispatch>();
    const fetchRequests = useCallback(async () => {
        try {
            const response = await axios.get(`${BASE_URL}/user/requests/received`, {
                withCredentials: true
            });
            const data = response.data?.data ?? response.data;
            dispatch(addRequests(data ?? []));
            console.log("Requests data:", data);
        } catch (error) {
            console.error("Error fetching requests:", error);
        }
    }, [dispatch]);
    const reviewRequests = async (status: 'accepted' | 'rejected', _id: string) => {
        try {
            console.log(`Reviewing request ${_id} with status ${status}`);
            const response = await axios.post(`${BASE_URL}/request/review/${status}/${_id}`, {}, {
                withCredentials: true
            });
            console.log('Review response:', response.data);
            // refresh the list
            await fetchRequests();
        }
        catch (error) {
            console.error("Error reviewing requests:", error);
        }
        // Future implementation for reviewing requests
    }

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests, user]);

    if (!requests || requests.length === 0) {
        return <p className="text-center mt-10 text-gray-500">No requests found.</p>
    }

    return (
        <div>
            {/* Debug render: uncomment for development console logs */}
            <h1 className="text-center mt-10 text-2xl font-medium">Requests</h1>
            <div className="flex flex-col items-center gap-4 mt-4">
                {requests.map((req: Request) => (
                    <ConnectionUser key={req._id} user={req.fromUserId} showButtons={true} onAccept={(u) => reviewRequests('accepted', u._id)} onReject={(u) => reviewRequests('rejected', u._id)} />
                ))}
            </div>
        </div>
    )
}

export default Requests