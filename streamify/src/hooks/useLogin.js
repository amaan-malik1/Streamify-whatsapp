import React from 'react'
import { mutateLogin } from '../lib/api';
import { QueryClient, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const useLogin = () => {
    const queryClient = useQueryClient();
    const { mutate, isPending, error } = useMutation({
        mutationFn: mutateLogin,
        onSuccess: (() => {
            queryClient.invalidateQueries({ queryKey: ['authUser'] });
            toast.success("Login Success")
        })
    });

    return { error, isPending, loginMutation: mutate };

}

export default useLogin;
