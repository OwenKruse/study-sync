import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const connectionString = 'mongodb+srv://owenoakenheels:4Frozen95@users.cuzqvke.mongodb.net/?retryWrites=true&w=majority'

const dbName = 'myapp';
const secretKey = 'key';

export default async function loginHandler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { email, password } = req.body;

        // Connect to the MongoDB database
        const client = new MongoClient(connectionString);
        await client.connect();
        const db = client.db(dbName);

        // Check if the user exists
        const user = await db.collection('users').findOne({ email });
        if (!user) {
            res.status(401).json({ message: 'Incorrect email or password' });
            return;
        }

        // Check if the password is correct
        const passwordMatches = await bcrypt.compare(password, user.password);
        if (!passwordMatches) {
            res.status(401).json({ message: 'Incorrect email or password' });
            return;
        }

        // Create a JWT token and return it to the client
        const token = jwt.sign({ email }, secretKey);
        res.status(200).json({ message: 'Login successful', token });
    } else {
        // Handle any other HTTP method
        res.status(405).json({ message: 'Method not allowed' });
    }
}
