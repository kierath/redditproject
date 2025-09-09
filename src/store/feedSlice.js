import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const CLIENT_ID = 'bB8HBA9aWYjLoPIYk_kUdQ';
const REDIRECT_URI = 'http://localhost:5173/';
const SCOPES = 'read';
const AUTH_URL = `https://www.reddit.com/api/v1/authorize?client_id=${CLIENT_ID}&response_type=token&state=random&redirect_uri=${REDIRECT_URI}&duration=temporary&scope=${SCOPES}`;

// Get or refresh access token
export async function getAccessToken() {
  const hash = window.location.hash; // e.g. #access_token=...&token_type=...&expires_in=3600&scope=...
  if (hash.includes('access_token')) {
    const params = new URLSearchParams(hash.replace('#', '?')); // Replace # with ? to use URLSearchParams
    const token = params.get('access_token'); 
    const expiresIn = parseInt(params.get('expires_in'), 10) || 3600;
    const expiresAt = Date.now() + expiresIn * 1000;

    localStorage.setItem('reddit_token', token);
    localStorage.setItem('reddit_token_expires_at', expiresAt);
    window.history.replaceState(null, '', window.location.pathname); // Clean URL

    return token;
  }

  const storedToken = localStorage.getItem('reddit_token');
  const storedExpiresAt = parseInt(localStorage.getItem('reddit_token_expires_at'), 10) || 0;
  if (storedToken && Date.now() < storedExpiresAt) return storedToken;

  window.location.href = AUTH_URL; // Redirect to Reddit for auth
  return null; // Redirecting, so return null
}

// Fetch popular posts
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async (_, { rejectWithValue }) => { 
  const token = await getAccessToken(); // Ensure we have a valid token
  if (!token) return rejectWithValue('Missing Reddit access token');

  const response = await fetch('https://oauth.reddit.com/r/popular', {
    headers: { 
      Authorization: `Bearer ${token}` 
    },
  });

  if (!response.ok) return rejectWithValue('Failed to fetch posts');

  const data = await response.json();
  return data.data.children.map(({ data }) => ({ 
    id: data.id,
    title: data.title,
    image:
      (data.preview?.images?.[0]?.source?.url ||
        (data.thumbnail?.startsWith('http') ? data.thumbnail : null))?.replace(/&amp;/g, '&') ||
      null,
  }));
});

// Search posts
export const searchPosts = createAsyncThunk(
  'posts/searchPosts',
  async ({ query, sort }, { rejectWithValue }) => {
    const token = await getAccessToken();
    if (!token) return rejectWithValue('Missing Reddit access token');

    const response = await fetch(
      `https://oauth.reddit.com/search?q=${encodeURIComponent(query)}&sort=${sort}`,{ 
        headers: { 
          Authorization: `Bearer ${token}` 
        } 
      });

    if (!response.ok) return rejectWithValue('Failed to search posts');

    const data = await response.json();
    return data.data.children.map(({ data }) => ({
      id: data.id,
      title: data.title,
      image:
        (data.preview?.images?.[0]?.source?.url ||
          (data.thumbnail?.startsWith('http') ? data.thumbnail : null))?.replace(/&amp;/g, '&') ||
        null,
    }));
  }
);

export const feedSlice = createSlice({
  name: 'posts',
  initialState: {
    posts: [],
    loading: false,
    error: null,
    after: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.posts = action.payload;
        state.loading = false;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message;
      })
      .addCase(searchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchPosts.fulfilled, (state, action) => {
        state.posts = action.payload;
        state.loading = false;
      })
      .addCase(searchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message;
      });
  },
});

export default feedSlice.reducer;
