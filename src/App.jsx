import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PostList } from './components/PostList';
import './App.css';

export const App = () => {
  return (
    <Router>
      <div className="header">
        <h1>Funky Reddit Feed</h1>
      </div>

      <Routes>
        {/* Popular posts */}
        <Route path="/" element={<PostList />} />

        {/* Subreddit posts */}
        <Route path="/r/:subreddit" element={<PostList />} />

        {/* Search results */}
        <Route path="/search" element={<PostList searchPage />} />

        {/* Placeholder for individual post view */}
        <Route path="/post/:subreddit/:id" element={<p>Post details coming soon...</p>} />
      </Routes>
    </Router>
  );
};
