import React from 'react';
import { PostList } from './components/PostList';
import './App.css';

export const App = () => {
  return (
    <div className="header">
      <h1>Funky Reddit Feed</h1>
      <PostList />
    </div>
  );
};
