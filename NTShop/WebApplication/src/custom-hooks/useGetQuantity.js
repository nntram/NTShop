import React, {useEffect} from 'react'
import cartApi from '../api/CartApi';
import useGetCurrentUser from './useGetCurrentUser';
import { useQuery } from 'react-query';
import { useState } from 'react';

const useGetQuantity = () => {
    const currentUser = useGetCurrentUser()
    const [totalQuantity, setTotalQuantity] = useState(0)

    const getCartQuantity = async () => {
        try {
            const response = await cartApi.getCartQuantity()
            return response;
        } catch (error) {
            console.log("Failed to get cart: ", error);
        }
    };

    const queryQuantity = useQuery(
        { queryKey: ['cartQuantity', currentUser], queryFn: () => getCartQuantity(), enabled: Boolean(currentUser) },
    )

    useEffect(() => {
        const updateQuatity = () => {
            if (currentUser && queryQuantity.data) {
                setTotalQuantity(queryQuantity.data)
            }
            else{
                setTotalQuantity(0)
            }
        }
        updateQuatity()
        
    }, [queryQuantity])

    return totalQuantity;

}

export default useGetQuantity