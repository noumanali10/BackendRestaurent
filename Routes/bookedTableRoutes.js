const express = require('express');
const router = express.Router();
const Reservation = require('../Models/reservationModel');
const Table = require('../Models/tableModel');

// @route GET /reservation/booked-tables
// @desc Get booked tables for a specific slot
// @access Public
router.get('/booked-tables', async (req, res) => {
    const { date, slot } = req.query;

    try {
        // Find all reservations for the given date and slot
        const reservations = await Reservation.find({ date, slot }).populate('table');

        // Get the list of booked tables
        const bookedTables = reservations.map(reservation => ({
            tableId: reservation.table._id,
            tableName: reservation.table.name,
        }));

        res.json({ bookedTables });
    } catch (error) {
        console.error('Error fetching booked tables:', error.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
