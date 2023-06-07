import './styles/App.css';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './features/auth/Login';
import RequireAuth from './features/auth/RequireAuth';
import UsersList from './features/users/UsersList';
import Register from './features/register/Register';


function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<Register />} />
        <Route path='login' element={<Login />} />

        <Route element={<RequireAuth />}>
          <Route path='userslist' element={<UsersList />} />
        </Route>

      </Route>
    </Routes >
  )
}

export default App;
