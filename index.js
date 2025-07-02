const express = require('express');
const bwipjs = require('bwip-js');

const app = express();
const PORT = process.env.PORT || 8080;

app.get('/', (req, res) => {
    res.send('Use /barcode?data=your-gs1-data to generate a barcode');
});

app.get('/barcode', (req, res) => {
    const data = req.query.data;
    if (!data) {
        return res.status(400).send('Missing "data" query parameter');
    }

    try {
        bwipjs.toBuffer({
            bcid: 'gs1-128',       // Barcode type
            text: data,            // Text to encode
            scale: 3,              // 3x scaling
            height: 10,            // Bar height, in mm
            includetext: true,     // Show human-readable text
            textxalign: 'center',  // Centered text
        }, (err, png) => {
            if (err) {
                return res.status(400).send('Error generating barcode: ' + err);
            }
            res.set('Content-Type', 'image/png');
            res.send(png);
        });
    } catch (e) {
        res.status(500).send('Internal error: ' + e.message);
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
