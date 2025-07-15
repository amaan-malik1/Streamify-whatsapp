import { useMutation, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { mutateSignup } from '../lib/api'
import toast from 'react-hot-toast';

const useSignup = () => {
    const queryClient = useQueryClient();

    const { mutate, error, isPending } = useMutation({
        mutationFn: mutateSignup,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["authUser"] })
            toast.success("Signup successful")
        }
    });

    return { signupMutaion: mutate, error, isPending }
}

export default useSignup
