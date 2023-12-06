import { useState, useEffect } from 'react';
import axios from 'react'
 
const BASE_URL = "http://localhost:3001"
function App() {
  //create state variable to store all avaiable posts
  const [posts, setPosts] = useState([]);
  //create state variable to store data for a new post
  const [newPost, setNewPost] = useState({id:0, title: "", content: "", comments: []});
  const [editingPost, setEditingPost] = useState(null);

  
  const handleDelete = async (postId) => {
    try {
      await axios.delete(`${BASE_URL}/posts/${postId}`)
      setPosts(posts.filter(post => post.id !== postId));
    } catch (error) {
      console.error("ERROR DELETING POSTS:", error);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    //upddate the id of the new post to be the current datetime
    setNewPost({...newPost, id: Date.now()})
    try {
      await axios.post(`${BASE_URL}/posts`, newPost)
      setPosts([...posts, newPost]);
      setNewPost({id: 0, title: "", content: "", comments: []});
    } catch (error) {
      console.error("Error adding post:", error);
    }
  }

  const handleUpdatePost = async (e) => {
    e.preventDefault();
  
    try {
      await axios.put(`${BASE_URL}/posts/${editingPost.id}`, editingPost);
      // Update the posts state to reflect changes
      setPosts(posts.map(post => (post.id === editingPost.id ? editingPost : post)));
      // Reset editingPost to null
      setEditingPost(null);
    } catch (error) {
      console.error('Error updating post: ', error);
    }
  };
  
  //use effect to use axios to fetch all blog post on page load 
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/posts`);
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching post: ', error);
      }
    }
    fetchPosts();
  }, []); //only want effect to run a single time when the page 1st loads
  
  return (
    <div className="App">
      <h1>Blog Posts</h1>
      <ul>
        {posts.map(post => (
          <li key={post.id}>
            {editingPost && (
            <form onSubmit={handleUpdatePost}>
              <input
                type='text'
                placeholder='Title'
                value={editingPost.title}
                onChange={(e) => setEditingPost({...editingPost, title: e.target.value})}
              />
              <textarea 
                placeholder='Content'
                value={editingPost.content}
                onChange={(e) => setEditingPost({...editingPost, content: e.target.value})}
              />
              <button type='submit'>Update Post</button>
            </form>
)}
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            <button onClick={() => setEditingPost(post)}>Edit</button>
            <button onClick={() => handleDelete(post.id)}>Delete post</button>
          </li>
))}
      </ul>
      {/* {posts ? JSON.stringify(posts, null, 2) : "Loading..."} */}
      <form onSubmit={handleSubmit}>
        <input
          type = 'text'
          placeholder='Title'
          value={newPost.title}
          onChange={(e) => setNewPost({...newPost, title: e.target.value})}    
        />
        <textarea 
          placeholder='Content'
          value={newPost.content}
          onChange={(e) => setNewPost({...newPost, content: e.target.value})}
        />
        <button type='submit'>Add Post</button>
      </form>
    </div>
  );
}

export default App;
