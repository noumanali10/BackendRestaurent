const express = require('express');
const router = express.Router();
const Table = require('../Models/tableModel');

// @route   POST /api/tables
// @desc    Create a new table
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { name, seat } = req.body;

    let table = new Table({
      name,
      seat
    });

    await table.save();
    res.json(table);
  } catch (error) {
    console.error('Error creating table:', error.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/tables
// @desc    Get all tables
// @access  Public
router.get('/', async (req, res) => {
  try {
    const tables = await Table.find();
    res.json(tables);
  } catch (error) {
    console.error('Error fetching tables:', error.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/tables/:id
// @desc    Get table by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);

    if (!table) {
      return res.status(404).json({ msg: 'Table not found' });
    }

    res.json(table);
  } catch (error) {
    console.error('Error fetching table:', error.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/tables/:id
// @desc    Update a table
// @access  Public
router.put('/:id', async (req, res) => {
  try {
    const { name, seat } = req.body;

    let table = await Table.findById(req.params.id);

    if (!table) {
      return res.status(404).json({ msg: 'Table not found' });
    }

    table.name = name || table.name;
    table.seat = seat || table.seat;

    await table.save();
    res.json(table);
  } catch (error) {
    console.error('Error updating table:', error.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/tables/:id
// @desc    Delete a table
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);

    if (!table) {
      return res.status(404).json({ msg: 'Table not found' });
    }

    await table.remove();
    res.json({ msg: 'Table removed' });
  } catch (error) {
    console.error('Error deleting table:', error.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
