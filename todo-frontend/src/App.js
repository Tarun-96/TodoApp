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
import './App.css';

// ProtectedRoute component
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

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editId, setEditId] = useState(null);

  // New state to track which descriptions are expanded
  const [expandedIds, setExpandedIds] = useState([]);

  const toggleExpand = (id) => {
    setExpandedIds(prev =>
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
        await addItem({ title, description });
      }
      setTitle('');
      setDescription('');
      setEditId(null);
    } catch (err) {
      alert('Error: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setTitle(item.title);
    setDescription(item.description);
  };

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
            sx={{
              display: 'flex',
              justifyContent: 'space-between', // Space out text and buttons
              alignItems: 'flex-start', // Align text to the top
              paddingRight: '16px', // Add some space to avoid overlap with buttons
            }}
          >
            <ListItemText
              primary={item.title}
              secondary={
                (() => {
                  const wordCount = item.description.trim().split(/\s+/).length;
                  const isExpanded = expandedIds.includes(item.id);
                  const shouldShowToggle = wordCount > 10;

                  const displayedText = isExpanded || !shouldShowToggle
                    ? item.description
                    : item.description.split(/\s+/).slice(0, 10).join(' ') + '...';

                  return (
                    <>
                      <span style={{ wordWrap: 'break-word' }}>{displayedText}</span>
                      {shouldShowToggle && (
                        <Button
                          size="small"
                          onClick={() => toggleExpand(item.id)}
                          sx={{
                            ml: 1,
                            textTransform: 'none',
                            fontSize: '0.75rem',
                            display: 'inline-block',
                          }}
                        >
                          {isExpanded ? 'Show Less' : 'Read More'}
                        </Button>
                      )}
                    </>
                  );
                })()
              }
              sx={{
                flexGrow: 1, // Make the text area take available space
                overflowWrap: 'break-word', // Prevent overflow if the text is long
              }}
            />
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
