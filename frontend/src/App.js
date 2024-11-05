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
import SpeechRecognitionComponent from './components/TestSpeechRecognition';
import WakeWords from './components/WakeWords';

const App = () => {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);

  const handlePostAdded = (newPost) => {
    setPosts([...posts, newPost]);
  };

  const handlePostDeleted = (deletedPostId) => {
    setPosts((prevPosts) => prevPosts.filter(post => post.id !== deletedPostId));
  };

  useEffect(() => {
    const savedToken = localStorage.getItem('access_token');
    if (savedToken) {
      setUser({ token: savedToken });
    }
  }, []);


  const [startRecognition, setStartRecognition] = useState(false);

  const handleWakeWordDetection = () => {
    // Funkcja uruchamiana po wykryciu słowa kluczowego, włączająca rozpoznawanie mowy
    setStartRecognition(true);

    // Opcjonalnie, możesz ustawić automatyczne wyłączenie po pewnym czasie:
    // setTimeout(() => setStartRecognition(false), 5000); // Przykładowo 5 sekund
  };

  return (
    <Router>
      <Layout>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/Leopard" element={<Leopard />} />
          <Route path="/Cheetah" element={<Cheetah />} />
          <Route path="/Text" element={<Leopard />} />
          <Route path="/CheetahFrontend" element={<CheetahFrontend />} />
          {/* <Route path="/AddPosts" element={<AddPost onPostAdded={handlePostAdded} />} />
          <Route path="/Posts" element={<Posts />} />
          <Route path="/EditPost/:id" element={<EditPost />} /> */}
          <Route path="/Login" element={<Login setUser={setUser} />} />
          <Route path="/logout" element={<Logout setUser={setUser} />} />
          <Route path="/AddPosts" element={user ? <AddPost onPostAdded={handlePostAdded} /> : <Navigate to="/Login" />} />
          <Route path="/EditPost/:id" element={user ? <EditPost /> : <Navigate to="/Login" />} />
          <Route path="/Posts" element={<Posts posts={posts} user={user} onPostDeleted={handlePostDeleted} />} />
          {/* <Route path="/Posts" element={<Posts onPostDeleted={handlePostDeleted} />} /> */}
          <Route path="/cheetahtest" element={<Cheetahtest />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={user ? <Profile /> : <Navigate to="/Login" />} />
          <Route path='/testt' element={<>
            <WakeWords onWakeWordDetected={handleWakeWordDetection} />
            <SpeechRecognitionComponent startRecognition={startRecognition} /></>} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
