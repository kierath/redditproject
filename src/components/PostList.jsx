import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPosts, searchPosts } from '../store/feedSlice';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { PostCard } from './PostCard';
import { SearchBar } from './SearchBar';
import { CategoryChips } from './CategoryChips';
import './PostList.css';


export const PostList = () => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts.posts);
  const loading = useSelector((state) => state.posts.loading);
  const error = useSelector((state) => state.posts.error);
  const { subreddit } = useParams();
  const location = useLocation();
  const [currentSearch, setCurrentSearch] = useState({ query: '', sort: 'relevance' });
  const navigate = useNavigate();

  // Handle initial load / route changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('q') || '';
    const sort = params.get('sort') || 'relevance';

    if (subreddit) {
      // Load subreddit posts initially
      dispatch(searchPosts({ query: `subreddit:${subreddit}`, sort: 'hot' }));
      setCurrentSearch({ query: '', sort: 'hot' });
    } else if (query) {
      setCurrentSearch({ query, sort });
      dispatch(searchPosts({ query, sort }));
    } else {
      dispatch(fetchPosts());
      setCurrentSearch({ query: '', sort: 'relevance' });
    }
  }, [dispatch, subreddit, location.search]);

  // Handle search bar input
const handleSearch = ({ query, sort }) => {
  setCurrentSearch({ query, sort });

  if (subreddit) {
    // Search inside subreddit
    dispatch(searchPosts({ query: `subreddit:${subreddit} ${query}`, sort }));
    navigate(`/r/${subreddit}?q=${encodeURIComponent(query)}&sort=${sort}`);
  } else if (query.trim()) {
    // Global search
    dispatch(searchPosts({ query, sort }));
    navigate(`/search?q=${encodeURIComponent(query)}&sort=${sort}`);
  } else {
    // Reset feed
    if (subreddit) {
      dispatch(searchPosts({ query: `subreddit:${subreddit}`, sort: 'hot' }));
      navigate(`/r/${subreddit}`);
    } else {
      dispatch(fetchPosts());
      navigate(`/`);
    }
  }
};


  return (
    <div className="post-list">
      <CategoryChips onSelect={(sub) => {
        dispatch(searchPosts({ query: `subreddit:${sub}`, sort: 'hot' }));
        navigate(`/r/${sub}`);
      }} />

      <SearchBar onSearch={handleSearch} />

      {loading && <p className="status-message">Loading posts...</p>}
      {error && <p className="status-message">Error: {error}</p>}
      {!loading && !error && posts.length === 0 && (
        <p className="status-message">
          {currentSearch.query ? 'No search results found.' : 'No posts found.'}
        </p>
      )}
      {!loading &&
        posts.map((post) => <PostCard key={post.id} post={post} />)}
    </div>
  );
};
