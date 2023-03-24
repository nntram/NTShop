import React, {useContext,} from 'react'
import { Navigate } from 'react-router-dom'
import { Outlet } from 'react-router-dom'
import AuthContext from '../context/AuthProvider'

const ProtectedRoute = () => {
    const { currentUser } = useContext(AuthContext)

    console.log(currentUser)
    return currentUser ? <Outlet /> : <Navigate to='/login' />
}

export default ProtectedRoute