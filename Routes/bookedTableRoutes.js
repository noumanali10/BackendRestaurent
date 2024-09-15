const express = require('express');
const router = express.Router();
const Reservation = require('../Models/reservationModel');
const Table = require('../Models/tableModel');

// @route GET /reservation/booked-tables
// @desc Get availability status for all tables for a specific slot
// @access Public
router.get('/booked-tables', async (req, res) => {
    const { date, slot } = req.query;

    try {
        // Fetch all tables
        const tables = await Table.find({});

        // Find all reservations for the given date and slot
        const reservations = await Reservation.find({ date, slot });

        // Get the list of booked table IDs
        const bookedTableIds = reservations.map(reservation => reservation.table.toString());

        // Generate an array of boolean values indicating whether each table is available or not
        const bookedTables = tables.map(table => !bookedTableIds.includes(table._id.toString()));

        // Respond with the array of boolean values
        res.json({ bookedTables });
    } catch (error) {
        console.error('Error fetching booked tables:', error.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
