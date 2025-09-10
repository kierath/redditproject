import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchComments } from '../store/feedSlice';
import './PostPage.css';

export const PostPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //Loads posts and comments for posts
  const posts = useSelector(state => state.posts.posts);
  const post = posts.find(p => String(p.id) === String(id));
  const comments = useSelector(state => state.posts.comments[id] || []);
  const loadingComments = useSelector(state => state.posts.commentsLoading[id]);

  //For post navigation
  const currentIndex = posts.findIndex(p => String(p.id) === String(id));
  const prevPost = currentIndex > 0 ? posts[currentIndex - 1] : null;
  const nextPost = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;

  useEffect(() => {
    if (post) {
      dispatch(fetchComments(post.id));
    }
  }, [dispatch, post]);

  if (!post) return <p>Post not found.</p>;

  return (
    <div className="post-page">
      <h2>{post.title}</h2>
      <div className="post-image-container">
        {post.image && <img src={post.image} alt={post.title} />}
        <div className="post-navigation">
          {prevPost && (
            <button onClick={() => navigate(`/post/${prevPost.id}`)}>⬆</button>
          )}
          {nextPost && (
            <button onClick={() => navigate(`/post/${nextPost.id}`)}>⬇</button>
          )}
        </div>
      </div>

      <h3>Comments</h3>
      {loadingComments && comments.length === 0 && (
        <p>Loading comments...</p>
      )}
      {comments.length > 0 ? (
        comments.map((comment, idx) => (
          <div key={idx} className="comment">
            <strong>{comment.author}</strong>: {comment.text}
          </div>
        ))
      ) : (
        !loadingComments && <p>No comments yet.</p>
      )}
    </div>
  );
};
