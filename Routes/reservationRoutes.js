const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Reservation = require('../Models/reservationModel');
const Table = require('../Models/tableModel');
const moment = require('moment');
const transporter = require('../Config/emailConfig')

// @route POST /reservation
// @desc Create a reservation
// @access Public

//Booked Table for this slot
router.post('/bookedtables', async (req, res) => {
    const { date, slot } = req.body;

    if (!date || !slot) {
        return res.status(400).json({ msg: 'Date and slot are required' });
    }

    try {
        // Find all reservations for the given date and slot
        const reservations = await Reservation.find({ date, slot }).populate('table');

        // Get the list of booked tables
        const bookedTables = reservations.map(reservation => ({
            tableId: reservation.table._id,
            tableName: reservation.table.name,
            available: reservation.available,
        }));

        res.json({ bookedTables });
    } catch (error) {
        console.error('Error fetching booked tables:', error.message);
        res.status(500).send('Server Error');
    }
});




router.post('/', [
    check('customerName', 'Customer Name is required').not().isEmpty(),
    check('phone', 'Phone is required').not().isEmpty(),
    check('email', 'Email is required').isEmail(),
    check('date', 'Date is required').not().isEmpty(),
    check('slot', 'Slot is required').not().isEmpty(),
    check('tableId', 'Table ID is required').not().isEmpty(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { date, slot, tableId } = req.body;

        // Validate if the reservation date and slot are in the future
        const reservationDate = moment(date);
        const currentTime = moment();
        const slotTime = moment(slot, 'h:mm A');

        if (reservationDate.isBefore(currentTime, 'day') || 
            (reservationDate.isSame(currentTime, 'day') && slotTime.isBefore(currentTime, 'minute'))) {
            return res.status(400).json({ msg: 'Reservations can only be made for future dates and slots' });
        }

        // Check if the requested table exists
        const table = await Table.findById(tableId);
        if (!table) {
            return res.status(404).json({ msg: 'Table not found' });
        }

        // Check if the requested table is already reserved for the selected date and slot
        const existingReservation = await Reservation.findOne({ date, slot, table: tableId });
        if (existingReservation) {
            return res.status(400).json({ msg: 'The selected table is already reserved for the chosen slot' });
        }

        // Create the reservation with the selected table
        const reservation = new Reservation({
            customerName: req.body.customerName,
            phone: req.body.phone,
            email: req.body.email,
            date,
            slot,
            description: req.body.description,
            table: tableId
        });

        await reservation.save();

        // Send email to the customer
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: req.body.email,
            subject: 'Reservation Confirmation',
            text: `Dear ${req.body.customerName},\n\nYour reservation for ${date} at ${slot} is confirmed.\n\nThank you for choosing our restaurant!`,
            html: `<p>Dear ${req.body.customerName},</p><p>Your reservation for ${date} at ${slot} is confirmed.</p><p>Thank you for choosing our restaurant!</p>`
        });
          
        const tableData = await Table.findById(tableId);


        // Send email to the restaurant manager
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: 'alinaman1296@gmail.com', // Replace with your restaurant manager's email
            subject: 'New Reservation',
            text: `A new reservation has been made:\n\nCustomer Name: ${req.body.customerName}\nPhone: ${req.body.phone}\nEmail: ${req.body.email}\nDate: ${date}\nSlot: ${slot}\nTable: ${tableData.name}\nDescription: ${req.body.description}`,
            html: `<p>A new reservation has been made:</p><p><strong>Customer Name:</strong> ${req.body.customerName}</p><p><strong>Phone:</strong> ${req.body.phone}</p><p><strong>Email:</strong> ${req.body.email}</p><p><strong>Date:</strong> ${date}</p><p><strong>Slot:</strong> ${slot}</p><p><strong>Table:</strong> ${tableData.name}</p><p><strong>Description:</strong> ${req.body.description}</p>`
        });

        res.json({ msg: 'Reservation created successfully', reservation });
    } catch (error) {
        console.error('Error creating reservation:', error.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
