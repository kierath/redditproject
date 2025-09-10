import React from 'react';
import {useNavigate} from 'react-router-dom';
import './PostCard.css';

export const PostCard = ({ post }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/post/${post.id}`);
  }

  return (
    <div className="post-card" onClick={handleClick}>
      {post.image ? (
        <img src={post.image} alt={post.title} />
      ) : (
        <div className="no-image">No Image</div>
      )}
      <div className="title">{post.title}</div>
    </div>
  );
};
