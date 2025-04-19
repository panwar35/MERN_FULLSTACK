const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');
const auth = require('../middleware/auth');
const User = require('../models/User');

// Create a new ticket
router.post('/', auth, async (req, res) => {
    try {
        const { eventName, eventDate, quantity, price } = req.body;
        
        const ticket = new Ticket({
            user: req.user.id,
            eventName,
            eventDate,
            quantity,
            price
        });

        await ticket.save();
        res.json(ticket);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get all tickets for a user
router.get('/my-tickets', auth, async (req, res) => {
    try {
        const tickets = await Ticket.find({ user: req.user.id });
        res.json(tickets);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get a single ticket
router.get('/:id', auth, async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);
        
        if (!ticket) {
            return res.status(404).json({ msg: 'Ticket not found' });
        }

        // Check if user owns the ticket
        if (ticket.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        res.json(ticket);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Cancel a ticket
router.put('/:id/cancel', auth, async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);
        
        if (!ticket) {
            return res.status(404).json({ msg: 'Ticket not found' });
        }

        // Check if user owns the ticket
        if (ticket.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        ticket.status = 'cancelled';
        await ticket.save();

        res.json(ticket);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get all tickets (admin only)
router.get('/all', auth, async (req, res) => {
    try {
        // Check if user is admin
        const user = await User.findById(req.user.id);
        if (user.role !== 'admin') {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        const tickets = await Ticket.find().populate('user', 'name email');
        res.json(tickets);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router; 