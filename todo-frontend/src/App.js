import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ItemsProvider, useItems } from './ItemsContext';
import {
  Container,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Stack,
} from '@mui/material';
import Login from './pages/Login';
import Signup from './pages/Signup';

// ProtectedRoute component (can also be moved to a separate file)
function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('jwt_token');
    if (!token) navigate('/login');
    setLoading(false);
  }, [navigate]);

  if (loading) return <div>Loading...</div>;
  
  return children;
}

function AppContent() {
  const { items, addItem, updateItem, deleteItem } = useItems();
  const navigate = useNavigate();
  
  // Local state for form fields and editing
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editId, setEditId] = useState(null);

  //IT will  add/update  on form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Client-side validation
    if (!title.trim()) {
      alert('Title is required');
      return;
    }
    if (title.length > 255) {
      alert('Title must be less than 255 characters');
      return;
    }
    if (description.length > 1000) {
      alert('Description is too long');
      return;
    }

    try {
      if (editId) {
        await updateItem(editId, { title, description });
      } else {
        await addItem({ title, description }); // user_id comes from backend via JWT
      }
      setTitle('');
      setDescription('');
      setEditId(null);
    } catch (err) {
      alert('Error: ' + (err.response?.data?.error || err.message));
    }
  };

  // Handle the  edit button
  const handleEdit = (item) => {
    setEditId(item.id);
    setTitle(item.title);
    setDescription(item.description);
  };

  // Handle the  cancel edit
  const handleCancel = () => {
    setEditId(null);
    setTitle('');
    setDescription('');

  };

  const handleLogout = () => {
  localStorage.removeItem('jwt_token');
  navigate('/login');
};

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
     <Stack 
        direction="row" 
        justifyContent="space-between" 
        alignItems="center" 
        sx={{ mb: 4 }}
      >
        <Typography variant="h4">To-Do App</Typography>
        <Button 
          variant="contained" 
          color="error" 
          onClick={handleLogout}
          sx={{ textTransform: 'none' }}
        >
          Logout
        </Button>
      </Stack>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            inputProps={{ maxLength: 255 }}
          />
          <TextField
            label="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            inputProps={{ maxLength: 1000 }}
          />
          <Stack direction="row" spacing={2}>
            <Button type="submit" variant="contained" color="primary">
              {editId ? 'Update' : 'Add'}
            </Button>
            {editId && (
              <Button
                type="button"
                variant="outlined"
                color="secondary"
                onClick={handleCancel}
              >
                Cancel
              </Button>

            )}
          
          </Stack>
        </Stack>
      </form>
      <List sx={{ mt: 4 }}>
        {items.map(item => (
          <ListItem
            key={item.id}
            secondaryAction={
              <Stack direction="row" spacing={1}>
                <Button size="small" onClick={() => handleEdit(item)}>
                  Edit
                </Button>
                <Button
                  size="small"
                  color="error"
                  onClick={() => deleteItem(item.id)}
                >
                  Delete
                </Button>
              </Stack>
            }
          >
            <ListItemText
              primary={item.title}
              secondary={item.description}
            />
          </ListItem>
        ))}
      </List>
    </Container>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
      
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

       
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <ItemsProvider>
                <AppContent />
              </ItemsProvider>
            </ProtectedRoute>
          }
        />

        
        <Route path="*" element={<Navigate to="/login" replace />} />


        
      </Routes>
    </BrowserRouter>
  );
}

export default App;