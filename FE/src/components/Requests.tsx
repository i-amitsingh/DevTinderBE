import axios from 'axios';
import { useEffect, useCallback, useState } from 'react';
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
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const fetchRequests = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}/user/requests/received`, {
                withCredentials: true
            });
            // Some endpoints return { data } while others return array directly
            const data = response.data?.data ?? response.data;
            dispatch(addRequests(data ?? []));
        } catch (error) {
            console.error("Error fetching requests:", error);
        }
        setIsLoading(false);
    }, [dispatch]);
    const reviewRequests = async (status: 'accepted' | 'rejected', _id?: string) => {
        if (!_id) {
            console.warn('No request id supplied to reviewRequests.');
            return;
        }
        try {
            const response = await axios.post(`${BASE_URL}/request/review/${status}/${_id}`, {}, {
                withCredentials: true
            });
            // refresh the list
            await fetchRequests();
        }
        catch (error) {
            const axiosError = error as any;
            console.error("Error reviewing requests:", axiosError?.response?.status, axiosError?.response?.data || axiosError.message || axiosError);
        }
        // Future implementation for reviewing requests
    }

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests, user]);

    if (isLoading) {
        return <p className="text-center mt-10 text-gray-500">Loading requests...</p>
    }

    if (!requests || requests.length === 0) {
        return <p className="text-center mt-10 text-gray-500">No requests found.</p>
    }

    return (
        <div>
            {/* Debug render: uncomment for development console logs */}
            <h1 className="text-center mt-10 text-2xl font-medium">Requests</h1>
            <div className="flex flex-col items-center gap-4 mt-4">
                {requests.map((req: Request) => (
                    <ConnectionUser
                        key={req._id}
                        user={req.fromUserId}
                        requestId={req._id}
                        showButtons={true}
                        onAccept={(requestId) => reviewRequests('accepted', requestId)}
                        onReject={(requestId) => reviewRequests('rejected', requestId)}
                    />
                ))}
            </div>
        </div>
    )
}

export default Requests