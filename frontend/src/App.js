import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Leopard from './pages/Leopard';
import Posts from './components/Posts';
import AddPost from './components/AddPost';
import EditPost from './components/EditPost';
import Login from './components/Login';
import Logout from './components/Logout';
import Register from './components/Register';
import Profile from './components/Profile';
import { AuthProvider } from './hooks/useAuth';
import ProtectedRoute from './components/ProtectedRoute';
import PostDetail from './components/PostDetail';

const App = () => {
  const [posts, setPosts] = useState([]);

  const handlePostAdded = (newPost) => {
    setPosts([...posts, newPost]);
  };

  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/register" element={<Register />} />
            <Route path="/Leopard" element={<Leopard />} />
            <Route path="/PostDetail/:id" element={<PostDetail />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/AddPosts"
              element={
                <ProtectedRoute>
                  <AddPost onPostAdded={handlePostAdded} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/EditPost/:id"
              element={
                <ProtectedRoute>
                  <EditPost />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Posts"
              element={
                <ProtectedRoute>
                  <Posts />
                </ProtectedRoute>
              } />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
};

export default App;
