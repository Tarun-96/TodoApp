import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  // State to store items
  const [items, setItems] = useState([]);
  // State for form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  // State to track if editing
  const [editId, setEditId] = useState(null);

  // Fetch items from backend on page load
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const res = await axios.get('http://localhost:3001/items');
    setItems(res.data);
  };

  // Handle form submit for add or update
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) return alert('Title is required');
    if (editId) {
      // Update item
      await axios.put(`http://localhost:3001/items/${editId}`, { title, description });
    } else {
      // For now, use user_id = 1 for demo
     await axios.post('http://localhost:3001/items', { 
  user_id: 1, // <-- This must match an existing user's ID
  title, 
  description 
});
    }
    setTitle('');
    setDescription('');
    setEditId(null);
    fetchItems();
  };

  // Handle delete
  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:3001/items/${id}`);
    fetchItems();
  };

  // Handle edit
  const handleEdit = (item) => {
    setEditId(item.id);
    setTitle(item.title);
    setDescription(item.description);
  };

  return (
    <div className="App" style={{ maxWidth: 500, margin: 'auto', padding: 20 }}>
      <h2>To-Do Items</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          style={{ width: '100%', marginBottom: 10 }}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          style={{ width: '100%', marginBottom: 10 }}
        />
        <button type="submit">{editId ? 'Update' : 'Add'} Item</button>
        {editId && <button type="button" onClick={() => { setEditId(null); setTitle(''); setDescription(''); }}>Cancel</button>}
      </form>
      <ul>
        {items.map(item => (
          <li key={item.id} style={{ marginBottom: 10 }}>
            <b>{item.title}</b> - {item.description}
            <button onClick={() => handleEdit(item)} style={{ marginLeft: 10 }}>Edit</button>
            <button onClick={() => handleDelete(item.id)} style={{ marginLeft: 5 }}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
