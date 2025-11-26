import axios, { AxiosError } from 'axios';
import { useEffect, useCallback, useState } from 'react';
import { BASE_URL } from '../utils/Constants';
import { useDispatch, useSelector } from 'react-redux';
import { addConnections } from '../utils/connectionsSlice';
import type { User } from '../types/User';
import type { RootState } from '../utils/appStore';
import type { AppDispatch } from '../utils/appStore';
import ConnectionUser from './ConnectionUser';


const Connections = () => {
    const connections = useSelector((state: RootState) => state.connections);
    const requests = useSelector((state: RootState) => state.requests);
    const user = useSelector((state: RootState) => state.user?.user);
    const dispatch = useDispatch<AppDispatch>();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const fetchConnections = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}/user/connection`, {
                withCredentials: true,
            });
            const data = response.data?.data ?? response.data;
            console.log('Raw connections response', response.data);
            if (!data) {
                console.warn('No connections data in response', response.data);
            }
            dispatch(addConnections(data ?? []));
            console.log('Connections data:', data);
        } catch (err) {
            const error = err as AxiosError;
            console.error('Error fetching connections:', error.message ?? error);
        }
        setIsLoading(false);
    }, [dispatch]);

    useEffect(() => {
        fetchConnections();
    }, [fetchConnections, requests, user]);

    if (isLoading) {
        return <p className="text-center mt-10 text-gray-500">Loading connections...</p>;
    }

    if (!connections || connections.length === 0) {
        return <p className="text-center mt-10 text-gray-500">No connections found.</p>;
    }

    return (
        <div>
            <h1 className="text-center mt-10 text-2xl font-medium">Connections</h1>
            {/* Connections list will be rendered here in future */}
            <div className="flex flex-col items-center gap-4 mt-4">
                {connections.map((user: User) => (
                    <ConnectionUser key={user._id} user={user} />
                ))}
            </div>
        </div>
    )
}

export default Connections