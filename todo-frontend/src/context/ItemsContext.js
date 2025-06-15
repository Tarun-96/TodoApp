 import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import API from '../config/axiosConfig';


// Create the context
const ItemsContext = createContext();


export const ItemsProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  
  const fetchItems = async () => {
    
    const res = await API.get('/items');
    setItems(res.data);
  };

  
  useEffect(() => {
    fetchItems();
  }, []);

  // Functions to add, update, delete items
  const addItem = async (item) => {
   
    await API.post('/items', item);
    fetchItems();
  };

  const updateItem = async (id, item) => {
    
    await API.put(`/items/${id}`, item);
    fetchItems();
  };

  const deleteItem = async (id) => {
    
    await API.delete(`/items/${id}`);
    fetchItems();
  };

  return (
    <ItemsContext.Provider value={{ items, addItem, updateItem, deleteItem, fetchItems }}>
      {children}
    </ItemsContext.Provider>
  );
};

// Custom hook 
export const useItems = () => useContext(ItemsContext);