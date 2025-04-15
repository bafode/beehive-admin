import React, { useEffect } from 'react';
import axiosInstance from 'api/axiosInstance';
import useSWR from 'swr';
import FullPageLoader from './FullPageLoader';
import Profile from './profile';

const getUserData = async (url) => {
    const res = await axiosInstance.get(url);
    return res.data;
};
const ProfileGuard = () => {
    const { data, isLoading, error, mutate } = useSWR('/partner', getUserData);

    useEffect(() => {
        if (error) {
            window.location.href = '/auth/login';
        }
        mutate();
    }, []);

    //chec data
    if (!data) {
        return <FullPageLoader />;
    }

    return (
        <>
            <Profile user={data?.data} />
        </>
    );
};

export default ProfileGuard;
