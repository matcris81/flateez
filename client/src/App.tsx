import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Properties from './pages/Properties';
import PropertyDetail from './pages/PropertyDetail';
import Dashboard from './pages/Dashboard';
import Messages from './pages/Messages';
import Renters from './pages/Renters';
import RenterDetail from './pages/RenterDetail';
import Profile from './pages/Profile';

function App() {
  const { user } = useAuthStore();

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="properties" element={<Properties />} />
        <Route path="properties/:id" element={<PropertyDetail />} />
        <Route path="renters" element={<Renters />} />
        <Route path="renters/:id" element={<RenterDetail />} />
        <Route 
          path="dashboard" 
          element={user ? <Dashboard /> : <Navigate to="/login" />} 
        />
        <Route 
          path="messages" 
          element={user ? <Messages /> : <Navigate to="/login" />} 
        />
        <Route 
          path="profile" 
          element={user ? <Profile /> : <Navigate to="/login" />} 
        />
      </Route>
    </Routes>
  );
}

export default App;
