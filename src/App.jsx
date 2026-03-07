import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Page Views
import Home from './pages/Home';
import Register from './pages/Register';
import Biodata from './pages/Biodata';
import Events from './pages/Events';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import UserProfile from './pages/UserProfile'; // Added import
import PublicProfile from './pages/PublicProfile'; // Added import
// Admin Views
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminEvents from './pages/AdminEvents';
import AdminHosts from './pages/AdminHosts';
import AdminAddCandidate from './pages/AdminAddCandidate';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Login Route */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Protected App Routes with Standard Layout */}
          <Route element={
            <ProtectedRoute>
              <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <Navbar />
                <main className="main-content">
                  <Outlet />
                </main>
                <Footer />
              </div>
            </ProtectedRoute>
          }>
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<Events />} />
            <Route path="/register" element={<Register />} />
            <Route path="/biodata" element={<Biodata />} />
            <Route path="/profile" element={<UserProfile />} /> {/* Added /profile route */}
            <Route path="/candidate/:id" element={<PublicProfile />} /> {/* Added public profile view */}
            <Route path="*" element={<Home />} />
          </Route>

          {/*  Routes with Separate  Layout */}
          <Route path="/admin" element={
            <ProtectedRoute adminOnly={true}>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="events" element={<AdminEvents />} />
            <Route path="hosts" element={<AdminHosts />} />
            <Route path="add-candidate" element={<AdminAddCandidate />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
