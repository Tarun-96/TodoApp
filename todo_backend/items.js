const express = require('express');
const router = express.Router();
const pool = require('./db');
const Joi = require('joi');


const itemSchema = Joi.object({
  user_id: Joi.number().integer().required(),
  title: Joi.string().min(1).max(255).required(),
  description: Joi.string().allow('').optional(),
});


const updateItemSchema = Joi.object({
  title: Joi.string().min(1).max(255).required(),
  description: Joi.string().allow('').optional(),
});

// Get all items
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM items ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new item
router.post('/', async (req, res) => {

     const { error } = itemSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  const { user_id, title, description } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO items (user_id, title, description) VALUES ($1, $2, $3) RETURNING *',
      [user_id, title, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update an item
router.put('/:id', async (req, res) => {

    const { error } = updateItemSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { title, description } = req.body;
  const { id } = req.params;
  try {
    const result = await pool.query(
      'UPDATE items SET title = $1, description = $2 WHERE id = $3 RETURNING *',
      [title, description, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete an item
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM items WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




module.exports = router;