import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "./authSlice";

import React from 'react'

const RequireAuth = () => {
    const token = useSelector(selectCurrentToken)
    const location = useLocation()

    return (
        token
            ? <Outlet />
            : <Navigate to='/' state={{ from: location }} replace />
    )
}

export default RequireAuth