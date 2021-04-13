const express = require('express');
const app = express();
const PORT = 3000;

const iceCreams = [
    {
        id: 1,
        name: "Magnum Strawberry White",
        price: 24,
        description: "En perfekt kombination av sött och syrligt! Krämig jordgubbsglass med tunna strimmor av jordgubbssås – doppad i vit choklad."
    },
    {
        id: 2,
        name: "Solero Exotic",
        price: 20,
        description: "Solero Exotic är tillbaka! Len vaniljglass med en swirl och överdrag av exotiska frukter. Läskande god!"
    },
    {
        id: 3,
        name: "Sandwich",
        price: 18,
        description: "Sandwich kan man alltid lita på, en riktigt klassiker. Tiderna förändras, men inte den rena vaniljglassen mellan de goda chokladkexen."
    },
];

app.use(express.json());

// ENDPOINTS
// Get all ice creams
app.get('/api/ice-cream', (req, res) => {
    res.status(200).json(iceCreams);
});

// Get specific ice cream
app.get('/api/ice-cream/:id', (req, res) => {
    const id = req.params.id;

    const findSpecificIceCream = iceCreams.find((iceCream) => {
        return iceCream.id == id
    });

    if(!findSpecificIceCream) {
        res.status(404).json({'error': 'Oups... Detta id finns inte.'})
    };

    res.status(200).json(findSpecificIceCream)
});

// Add new ice cream
app.post('/api/ice-cream', (req, res) => {
    const iceCream = req.body

    let newId = 0
    iceCreams.forEach((iceCream) => {
        if(iceCream.id > newId) {
            newId = iceCream.id
        };
    });

    newId++

    iceCreams.push({
        id: newId,
        iceCream: iceCream,
    });

    res.status(201).json(req.body)
});

// Update existing ice cream
app.put('/api/ice-cream/:id', (req, res) => {
    const id = req.params.id
    const index = iceCreams.findIndex(iceCream => iceCream.id === id);
    const updatedIceCream = {
        id: id,
        iceCream: req.body,
    };
    iceCreams.splice(index, 1, ...updatedIceCream );

    res.status(204).json(null);
});

// Delete ice cream
app.delete('/api/ice-cream/:id', (req, res) => {
    const id = req.params.id;
    const index = iceCreams.findIndex(iceCream => iceCream.id === id);
    iceCreams.splice(index, 1);
    
    res.status(204).json(null)
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});