const Event = require('../models/Event');

const getEvents = async (req, res) => {
    try {
        const events = await Event.find().sort({ dateStart: 1 });
        // Map _id to id for frontend compatibility
        const formattedEvents = events.map(e => ({
            id: e._id,
            ...e._doc
        }));
        res.json(formattedEvents);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const addEvent = async (req, res) => {
    try {
        const event = new Event(req.body);
        const createdEvent = await event.save();
        res.status(201).json({ id: createdEvent._id, ...createdEvent._doc });
    } catch (error) {
        console.error('Error adding event:', error);
        res.status(400).json({ message: 'Invalid event data', error: error.message });
    }
};

const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (event) {
            await Event.deleteOne({ _id: event._id });
            res.json({ message: 'Event removed' });
        } else {
            res.status(404).json({ message: 'Event not found' });
        }
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getEvents,
    addEvent,
    deleteEvent,
};
