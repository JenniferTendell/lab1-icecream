const express = require('express');
const app = express();
const fs = require('fs');
const data = fs.readFileSync('iceCreams.json');
const iceCreams = JSON.parse(data)
const PORT = 3000;


app.use(express.json());
app.use(express.static('public'));

// Get all ice creams
app.get('/api/ice-cream', (req, res) => {
    res.status(200).json(iceCreams);
});

// Get specific ice cream
app.get('/api/ice-cream/:id', (req, res) => {
    const id = req.params.id;

    const specificIceCream = iceCreams.find((iceCream) => {
        return iceCream.id == id
    });

    if(!specificIceCream) {
        res.status(404).json({'error': 'Oups... Detta id finns inte.'})
    };

    res.status(200).json(specificIceCream)
});

// Add new ice cream
app.post('/api/ice-cream', (req, res) => {
    let newId = 0
    iceCreams.forEach((iceCream) => {
        if(iceCream.id > newId) {
            newId = iceCream.id
        };
    });

    newId++

    iceCreams.push({
        id: newId,
        ...req.body
    });

    fs.writeFile('iceCreams.json', JSON.stringify(iceCreams, null, 2), () => {
        res.status(201).json(req.body)
    })
});

// Update existing ice cream
app.put('/api/ice-cream/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const index = iceCreams.findIndex(iceCream => iceCream.id == id);
    
    if(index === -1) {
        res.status(404).json({'error': 'Oups... Detta id finns inte.'})
    };

    const updatedIceCream = {
        ...req.body,
        id: parseInt(id),
    };
    
    iceCreams.splice(index, 1, updatedIceCream );

    fs.writeFile('iceCreams.json', JSON.stringify(iceCreams, null, 2), () => {
        res.status(200).json(req.body);
    })
});

// Delete ice cream
app.delete('/api/ice-cream/:id', (req, res) => {
    const id = req.params.id;
    const index = iceCreams.findIndex(iceCream => iceCream.id == id);

    if(index === -1) {
        res.status(404).json('This ice cream does not exist')
        return
    }
    
    const deletedIceCream = iceCreams.splice(index, 1);

    fs.writeFile('iceCreams.json', JSON.stringify(iceCreams, null, 2), () => {
        res.status(200).json(deletedIceCream)
    })
    
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});