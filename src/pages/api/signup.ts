import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcrypt';

const connectionString = 'mongodb+srv://owenoakenheels:4Frozen95@users.cuzqvke.mongodb.net/?retryWrites=true&w=majority'
const dbName = 'myapp';
const secretKey = 'key';


export default async function signupHandler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { username, email, password } = req.body;

        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Connect to the MongoDB database
        const client = new MongoClient(connectionString, );
        await client.connect();
        const db = client.db(dbName);

        // Check if the user already exists
        const user = await db.collection('users').findOne({ email });
        if (user) {
            res.status(409).json({ message: 'User already exists' });
            return;
        }

        // Create a new user record
        const newUser = {
            username,
            email,
            password: hashedPassword,
        };
        const result = await db.collection('users').insertOne(newUser);

        if (result) {
            // Redirect to the login page if the user is successfully created
            res.status(200).json({ message: 'User created successfully' });
            return;
        } else {
            res.status(500).json({ message: 'Error creating user' });
            return;
        }
    } else {
        // Handle any other HTTP method
        res.status(405).json({ message: 'Method not allowed' });
    }
}
