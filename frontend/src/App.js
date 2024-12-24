import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Leopard from './pages/Leopard';
import Cheetah from './pages/Cheetah'
import CheetahFrontend from './pages/CheetahFrontend';
import Posts from './components/Posts';
import AddPost from './components/AddPost';
import EditPost from './components/EditPost';
import Cheetahtest from './components/cheetahtest';
import Login from './components/Login';
import Logout from './components/Logout';
import Register from './components/Register';
import Profile from './components/Profile';
import SpeechRecognitionComponent from './components/SpeechRecognition';
import WakeWords from './components/WakeWords';
// import axios from 'axios';
import { AuthProvider } from './hooks/useAuth';
import ProtectedRoute from './components/ProtectedRoute';
import PostDetail from './components/PostDetail';

const App = () => {
  const [posts, setPosts] = useState([]);

  const handlePostAdded = (newPost) => {
    setPosts([...posts, newPost]);
  };

  // const handlePostDeleted = (deletedPostId) => {
  //   setPosts((prevPosts) => prevPosts.filter(post => post.id !== deletedPostId));
  // };

  // const [startRecognition, setStartRecognition] = useState(false);

  // const handleWakeWordDetection = () => {
  //   // Funkcja uruchamiana po wykryciu słowa kluczowego, włączająca rozpoznawanie mowy
  //   setStartRecognition(true);

  //   // Opcjonalnie, możesz ustawić automatyczne wyłączenie po pewnym czasie:
  //   // setTimeout(() => setStartRecognition(false), 5000); // Przykładowo 5 sekund
  // };

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
            {/* <Route path="/Cheetah" element={<Cheetah />} /> */}
            {/* <Route path="/CheetahFrontend" element={<CheetahFrontend />} /> */}
            {/* <Route path="/Login" element={<Login setUser={setUser} />} />
            <Route path="/logout" element={<Logout setUser={setUser} />} /> */}

            {/* <Route path="/cheetahtest" element={<Cheetahtest />} /> */}
            {/* <Route path='/testt' element={<>
              <WakeWords onWakeWordDetected={handleWakeWordDetection} />
              <SpeechRecognitionComponent startRecognition={startRecognition} /></>} /> */}
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
