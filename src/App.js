import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import AuthForm from './pages/AuthForm';
import SubmitItemPage from './pages/SubmitItemPage';
import MatchResultsPage from './pages/MatchResultsPage';
import ChatPage from './pages/ChatPage';
import ChatCenterPage from './pages/ChatCenterPage';
import DashboardPage from './pages/DashboardPage';
import ItemDetailPage from './pages/ItemDetailPage';
import EditItemPage from './pages/EditItemPage';

import AdminDashboardPage from './pages/AdminDashboardPage';
import ManageUsersPage from './pages/ManageUsersPage';
import ManageItemsPage from './pages/ManageItemsPage';
import ManageMessagesPage from './pages/ManageMessagesPage';

import './App.css';

const isAdmin = localStorage.getItem('userEmail') === 'kkverma@university.edu';

function App() {
  return (
    <Router>
      <Routes>
        {/* 🔐 Auth & Core */}
        <Route path="/" element={<AuthForm />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/submit" element={<SubmitItemPage />} />
        <Route path="/matches" element={<MatchResultsPage />} />
        <Route path="/matches/:itemId" element={<MatchResultsPage />} />
        <Route path="/chat/:email" element={<ChatPage />} />
        <Route path="/chat-center" element={<ChatCenterPage />} />
        <Route path="/item/:id" element={<ItemDetailPage />} />
        <Route path="/edit/:id" element={<EditItemPage />} />

        {/* 🛠️ Admin Control */}
        <Route path="/admin" element={isAdmin ? <AdminDashboardPage /> : <Navigate to="/dashboard" />} />
        <Route path="/admin/users" element={isAdmin ? <ManageUsersPage /> : <Navigate to="/dashboard" />} />
        <Route path="/admin/items" element={isAdmin ? <ManageItemsPage /> : <Navigate to="/dashboard" />} />
        <Route path="/admin/messages" element={isAdmin ? <ManageMessagesPage /> : <Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;