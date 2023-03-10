import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcrypt';
const connectionString = 'mongodb+srv://owenoakenheels:4Frozen95@users.cuzqvke.mongodb.net/?retryWrites=true&w=majority'
const dbName = 'myapp';

export default async function changePasswordHandler(req: NextApiRequest, res: NextApiResponse) {
    try{
    const { email, password, oldPassword } = req.body;
    const saltRounds = 10;

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
    const passwordMatches = await bcrypt.compare(oldPassword, user.password);
    if (!passwordMatches) {
        res.status(401).json({ message: 'Incorrect email or password' });
        return;
    }
    const hashedPassword = await bcrypt.hash(password, saltRounds);


    // Find the user using the email and update the password using findOneAndUpdate
    const result = await db.collection('users').findOneAndUpdate(
        { email },
        { $set: { password: hashedPassword } }
    );

    if (result) {
        // Redirect to the login page if the user is successfully created
        res.status(200).json({ message: 'Password changed successfully' });
        return;
    }
    else {
        res.status(500).json({ message: 'Error changing password' });
        return;
    }
    } catch (error) {
        res.status(500).json({ message: 'Error changing password' });
        return;
    }
}