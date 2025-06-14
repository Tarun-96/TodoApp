 import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// Create the context
const ItemsContext = createContext();

// Provider component
export const ItemsProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  // Fetch items from backend
  const fetchItems = async () => {
    const res = await axios.get('http://localhost:3001/items');
    setItems(res.data);
  };

  // Run fetchItems on mount
  useEffect(() => {
    fetchItems();
  }, []);

  // Functions to add, update, delete items
  const addItem = async (item) => {
    await axios.post('http://localhost:3001/items', item);
    fetchItems();
  };

  const updateItem = async (id, item) => {
    await axios.put(`http://localhost:3001/items/${id}`, item);
    fetchItems();
  };

  const deleteItem = async (id) => {
    await axios.delete(`http://localhost:3001/items/${id}`);
    fetchItems();
  };

  return (
    <ItemsContext.Provider value={{ items, addItem, updateItem, deleteItem, fetchItems }}>
      {children}
    </ItemsContext.Provider>
  );
};

// Custom hook for easy use
export const useItems = () => useContext(ItemsContext);