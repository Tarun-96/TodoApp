const express = require('express');
const router = express.Router();
const pool = require('../config/db'); 
const Joi = require('joi');
const authenticateToken = require('../middleware/authMiddleware'); 

router.use(authenticateToken);


const itemSchema = Joi.object({
  user_id: Joi.number().integer().required(),
  title: Joi.string().min(1).max(255).required(),
  description: Joi.string().allow('').optional(),
});


const updateItemSchema = Joi.object({
  title: Joi.string().min(1).max(255).required(),
  description: Joi.string().allow('').optional(),
});

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM items WHERE user_id = $1 ORDER BY id ASC',
      [req.user.userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new item for the logged-in user
router.post('/', async (req, res) => {
  const { title, description } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO items (user_id, title, description) VALUES ($1, $2, $3) RETURNING *',
      [req.user.userId, title, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update and delete routes should also check user_id
router.put('/:id', async (req, res) => {
  const { title, description } = req.body;
  const { id } = req.params;
  try {
    const result = await pool.query(
      'UPDATE items SET title = $1, description = $2 WHERE id = $3 AND user_id = $4 RETURNING *',
      [title, description, id, req.user.userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found or not yours' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM items WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, req.user.userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found or not yours' });
    }
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




module.exports = router;