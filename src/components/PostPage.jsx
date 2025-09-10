import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchComments } from '../store/feedSlice';
import './PostPage.css'

export const PostPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const posts = useSelector(state => state.posts.posts);
  const post = posts.find(p => String(p.id) === String(id));
  const comments = useSelector(state => state.posts.comments[id] || []);
  const loadingComments = useSelector(state => state.posts.commentsLoading[id]);

  useEffect(() => {
    if (post) {
      dispatch(fetchComments(post.id));
    }
  }, [dispatch, post]);

  if (!post) return <p>Post not found.</p>;

  return (
    <div className="post-page">
      <h2>{post.title}</h2>
      {post.image && <img src={post.image} alt={post.title} />}

      <h3>Comments</h3>
      {loadingComments && comments.length === 0 && (
        <p>Loading comments...</p>
      )}
       {comments.length > 0 ? (
        comments.map((comment, id) => (
          <div key={id} className="comment">
            <strong>{comment.author}</strong>: {comment.text}
          </div>
        ))
      ) : (
        !loadingComments && <p>No comments yet.</p>
      )}
    </div>
  );
};
