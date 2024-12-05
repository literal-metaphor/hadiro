const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '4mb' })); // Accept JSON payloads up to 4 MB

let labeledDescriptors = [];
const referencesDir = path.join(__dirname, 'references');

// Get students' descriptor values
const classDirs = fs.readdirSync(referencesDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

for (const classDir of classDirs) {
    
    const classPath = path.join(referencesDir, classDir);
    const files = fs.readdirSync(classPath, { withFileTypes: true })
        .filter(dirent => dirent.isFile() && dirent.name.endsWith('.json'))
        .map(dirent => dirent.name);

    for (const file of files) {
        const filePath = path.join(classPath, file);
        const studentName = path.basename(file, '.json');
        const data = fs.readFileSync(filePath, 'utf-8');
        const json = JSON.parse(data);
        const descriptorArray = new Float32Array(Object.values(json).map(Number));

        labeledDescriptors.push({
            label: studentName,
            descriptors: [descriptorArray]
        });
    }

}

app.get('/api/load-descriptors', async (req, res) => {

    try {
        res.json(labeledDescriptors);
    } catch (error) {
        console.error('Error loading descriptors:', error);
        res.status(500).send('Error loading descriptors');
    }

});

app.post('/api/find-best-match', async (req, res) => {

    const { descriptor } = req.body;

    if (!descriptor) {
        return res.status(400).send('No descriptor provided');
    }

    try {
        const descriptorArray = new Float32Array(Object.values(descriptor));
        const bestMatches = findClosestMatches(descriptorArray, 10);
        res.json(bestMatches);
    } catch (error) {
        console.error('Error processing face:', error);
        res.status(500).send('Error processing face');
    }

})

// Serve static files (like index.html)
app.use(express.static(path.join(__dirname, 'public')));

// Default route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

function euclideanDistance(descriptor1, descriptor2) {

    if (descriptor1.length !== descriptor2.length) {
        throw new Error("Descriptors must have the same length");
    }

    let sum = 0;

    for (let i = 0; i < descriptor1.length; i++) {
        const diff = descriptor1[i] - descriptor2[i];
        sum += diff * diff;
    }

    return Math.sqrt(sum);

}

function findClosestMatches(descriptor, topN = 3) {

    // Calculate distances for all labeled descriptors
    const matches = labeledDescriptors.map(labeledDescriptor => {
        const distance = euclideanDistance(labeledDescriptor.descriptors[0], descriptor);
        return { label: labeledDescriptor.label, distance: distance };
    });

    // Sort matches by distance (ascending)
    matches.sort((a, b) => a.distance - b.distance);

    // Return the top N closest matches
    return matches.slice(0, topN);

}

