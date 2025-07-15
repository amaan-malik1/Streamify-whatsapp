import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react'
import { mutateLogout } from '../lib/api';
import toast from 'react-hot-toast';

const useLogout = () => {
    const queryClient = useQueryClient();
    const { mutate, error } = useMutation({
        mutationFn: mutateLogout,
        onSuccess: (() => {
            queryClient.invalidateQueries({ queryKey: ['authUser'] });
            toast.success("Logout Success")
        })
    });

    return { error, logoutMutation: mutate };

}

export default useLogout
