import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Leopard from './pages/Leopard';
import Cheetah from './pages/Cheetah'
import CheetahFrontend from './pages/CheetahFrontend';
import Posts from './components/Posts';
import AddPost from './components/AddPost';
import EditPost from './components/EditPost';

const App = () => {
  const [posts, setPosts] = useState([]);

  const handlePostAdded = (newPost) => {
    setPosts([...posts, newPost]);
  };

  const handlePostDeleted = (deletedPostId) => {
    setPosts(posts.filter(post => post.id !== deletedPostId));
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
          <Route path="/AddPosts" element={<AddPost onPostAdded={handlePostAdded} />} />
          <Route path="/Posts" element={<Posts />} />
          <Route path="/EditPost/:id" element={<EditPost />} />
          <Route path="/Posts" element={<Posts onPostDeleted={handlePostDeleted} />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
