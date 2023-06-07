import { useNavigate } from "react-router-dom";
import { useGetUsersQuery, useDeleteUserMutation, useBlockUserMutation, useUnblockUserMutation, } from "./usersApiSlice"
import { selectCurrentUser, logOut } from "../auth/authSlice";
import { useState } from "react";
import { useSelector } from "react-redux";


const UsersList = () => {
    const navigate = useNavigate()
    const [errMsg, setErrMsg] = useState('')
    const [selectAll, setSelectAll] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([])
    const currUser = useSelector(selectCurrentUser)

    const {
        data: users,
        isLoading,
        isSuccess,
        isError,
        error,
        refetch
    } = useGetUsersQuery()

    const [deleteUser] = useDeleteUserMutation()
    const [blockUser] = useBlockUserMutation()
    const [unblockUser] = useUnblockUserMutation()

    const handleDeleteUser = () => {
        selectedUsers.map(async (id) => {
            try {
                if (currUser === users.find((user) => user._id === id).user) {
                    await deleteUser(id)
                    logOut()
                    navigate('/')
                } else {
                    await deleteUser(id)
                    setSelectedUsers([])
                }
                refetch()
            } catch (err) {
                setErrMsg(err)
            }
        })
    };

    const handleBlockUser = () => {
        selectedUsers.map(async (id) => {
            try {
                if (currUser === users.find((user) => user._id === id).user) {
                    await blockUser(id)
                    logOut()
                    navigate('')
                } else {
                    await blockUser(id)
                    setSelectedUsers([])
                }
                refetch()
            } catch (err) {
                setErrMsg(err)
            }
        })
    }

    const handleUnblockUser = () => {
        selectedUsers.map(async (id) => {
            await unblockUser(id)
            setSelectedUsers([])
        })
        refetch()
    }

    const toggleUserSelection = (userId) => {
        setSelectedUsers((prevSelectedUsers) => {
            if (prevSelectedUsers.includes(userId)) {
                return prevSelectedUsers.filter((_id) => _id !== userId);
            } else {
                return [...prevSelectedUsers, userId];
            }
        });
    };

    const toggleSelectAll = () => {
        if (selectAll) {
            setSelectedUsers([]);
        } else {
            const allUserIds = users.map(user => user._id);
            setSelectedUsers(allUserIds);
        }

        setSelectAll(prevSelectAll => !prevSelectAll);
    };

    let content;
    if (isLoading) {
        content = <p>"Loading..."</p>;
    } else if (isSuccess) {
        content = (
            <section className="users">
                <h1>Users List</h1>
                <p className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                <div>
                    <div className="toolbar">
                        <button className="btn btn-danger" onClick={handleBlockUser}>
                            Block
                        </button>
                        <button className="btn btn-primary" onClick={handleUnblockUser}>
                            Unblock
                        </button>
                        <button className="btn btn-secondary" onClick={handleDeleteUser}>
                            Delete
                        </button>
                    </div>
                    <table className="table table-hover w-auto">
                        <thead>
                            <tr>
                                <th className="col">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        checked={selectAll}
                                        onChange={toggleSelectAll}
                                    />
                                </th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Last Login Time</th>
                                <th>Registration Time</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id}>
                                    <td>
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            checked={selectedUsers.includes(user._id)}
                                            onChange={() => toggleUserSelection(user._id)}
                                        />
                                    </td>
                                    <td>{user.user}</td>
                                    <td>{user.email}</td>
                                    <td>{new Date(user.lastLogin).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</td>
                                    <td>{new Date(user.registrationTime).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</td>
                                    <td>{user.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <button className="btn btn-default" onClick={() => navigate(-1)}>Back</button>
            </section>
        )
    } else if (isError) {
        content = <p>{JSON.stringify(error)}</p>;
    }

    return content
}
export default UsersList