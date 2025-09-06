import React from 'react';
import './PostCard.css';

export const PostCard = ({ post }) => {
  const { title, image } = post;

  return (
    <div className="post-card">
      {image ? (
        <img src={image} alt={title} />
      ) : (
        <div className="no-image">No Image</div>
      )}
      <div className="title">{title}</div>
    </div>
  );
};
