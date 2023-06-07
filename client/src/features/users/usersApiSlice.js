import { apiSlice } from "../../app/api/apiSlice";

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getUsers: builder.query({
            query: () => '/users',
            keepUnusedDataFor: 5,
        }),
        deleteUser: builder.mutation({
            query: (id) => ({
                url: `/users/${id}/delete`,
                method: 'DELETE',
            })
        }),
        blockUser: builder.mutation({
            query: (id) => ({
                url: `/users/${id}/block`,
                method: 'POST',
            })
        }),
        unblockUser: builder.mutation({
            query: (id) => ({
                url: `/users/${id}/unblock`,
                method: 'POST',
            })
        }),
    })
})

export const {
    useGetUsersQuery,
    useDeleteUserMutation,
    useBlockUserMutation,
    useUnblockUserMutation,
} = usersApiSlice