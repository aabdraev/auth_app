import { createSlice } from "@reduxjs/toolkit"

const register = createSlice({
    name: 'register',
    initialState: { username: null, email: null, password: null },
    reducers: {
        setCredentials: (state, action) => {
            const { username, email, password } = action.payload
            state.username = username
            state.email = email
            state.password = password
        },
    },
})

export const { setCredentials } = register.actions

export default register.reducer
