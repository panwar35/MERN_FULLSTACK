const express = require('express');
const router = express.Router();
const CustomerService = require('../models/CustomerService');
const auth = require('../middleware/auth');

// Create a new support ticket
router.post('/', auth, async (req, res) => {
    try {
        const { subject, message } = req.body;
        
        const supportTicket = new CustomerService({
            user: req.user.id,
            subject,
            message
        });

        await supportTicket.save();
        res.json(supportTicket);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get all support tickets for a user
router.get('/my-tickets', auth, async (req, res) => {
    try {
        const tickets = await CustomerService.find({ user: req.user.id });
        res.json(tickets);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get a single support ticket
router.get('/:id', auth, async (req, res) => {
    try {
        const ticket = await CustomerService.findById(req.params.id);
        
        if (!ticket) {
            return res.status(404).json({ msg: 'Ticket not found' });
        }

        // Check if user owns the ticket or is support staff
        if (ticket.user.toString() !== req.user.id && req.user.role !== 'support') {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        res.json(ticket);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Add response to a support ticket
router.post('/:id/response', auth, async (req, res) => {
    try {
        const ticket = await CustomerService.findById(req.params.id);
        
        if (!ticket) {
            return res.status(404).json({ msg: 'Ticket not found' });
        }

        const { message } = req.body;
        
        ticket.responses.push({
            user: req.user.id,
            message
        });

        await ticket.save();
        res.json(ticket);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Update ticket status (for support staff)
router.put('/:id/status', auth, async (req, res) => {
    try {
        if (req.user.role !== 'support') {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        const ticket = await CustomerService.findById(req.params.id);
        
        if (!ticket) {
            return res.status(404).json({ msg: 'Ticket not found' });
        }

        const { status } = req.body;
        ticket.status = status;
        await ticket.save();

        res.json(ticket);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router; 