const express = require('express');
const connectDB = require('./Config/db');
require('dotenv').config();
const cors = require('cors');
const cron = require('node-cron');
const Reservation = require('./Models/reservationModel');
const reservationRoutes = require('./Routes/reservationRoutes');
const tableRoutes = require('./Routes/tableRoutes');
// const bookedTable = require('./Routes/bookedTableRoutes');

const app = express();
const port = process.env.PORT || 5000;

// Connect to MongoDB
try {
    connectDB();
} catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
}

// Middleware
app.use(express.json());
app.use(cors());

// Cron job to delete past reservations
cron.schedule('* * * * *', async () => {
    try {
        const currentTime = new Date();
        // Delete reservations where the date is before today or the time slot is passed
        const deletedReservations = await Reservation.deleteMany({
            $or: [
                { date: { $lt: currentTime } },
                { date: { $eq: currentTime }, slot: { $lt: currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) } }
            ]
        });
        if (deletedReservations.deletedCount > 0) {
            console.log(`Deleted ${deletedReservations.deletedCount} past reservations.`);
        }
    } catch (error) {
        console.error('Error deleting past reservations:', error.message);
    }
});

// Routes
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.use('/api/reserve', reservationRoutes);
app.use('/api/tables', tableRoutes);
// app.use('/api/bookedtables', bookedTable);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
