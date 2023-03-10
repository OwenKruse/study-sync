import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';
const connectionString = 'mongodb+srv://owenoakenheels:4Frozen95@users.cuzqvke.mongodb.net/?retryWrites=true&w=majority'
const dbName = 'myapp';

export default async function deleteProfileHandler(req: NextApiRequest, res: NextApiResponse) {
    try {
        // Connect to the MongoDB database
        const client = new MongoClient(connectionString);
        await client.connect();
        const db = client.db(dbName);

        const email = req.body.email;

        // Delete the user from the database
        const user = await db.collection('users').findOne({ email });
        if (!user) {
            res.status(401).json({ message: 'User does not exist' });
            return;
        }

    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting profile' });
        return;
    }
}