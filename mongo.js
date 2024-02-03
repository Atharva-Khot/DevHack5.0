const MongoClient = require('mongodb').MongoClient;
const fs = require('fs');

// MongoDB connection URL
const url = 'mongodb://localhost:27017';
const dbName = 'devHack'; // Your database name
const collectionName = 'users'; // Your collection name

// Connect to MongoDB and extract userIds
MongoClient.connect(url, (err, client) => {
    if (err) {
        console.error('Error connecting to MongoDB:', err);
        return;
    }

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Find documents and extract userId field
    collection.find({}, { projection: { userId: 1, _id: 0 } }).toArray((err, docs) => {
        if (err) {
            console.error('Error retrieving documents:', err);
            return;
        }

        // Extract userIds
        const userIds = docs.map(doc => doc.userId);

        // Write userIds to a CSV file
        const csvData = userIds.join('\n');

        fs.writeFile('userIds.csv', csvData, (err) => {
            if (err) {
                console.error('Error writing to CSV file:', err);
                return;
            }
            console.log('UserIds written to userIds.csv successfully');

            // Close the MongoDB client
            client.close();
        });
    });
});
