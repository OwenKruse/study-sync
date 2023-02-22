import { MongoClient, ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

export default async function createCourse(req: { headers: { authorization: any; }; cookies: { token: any; }; body: { name: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { message?: string; error?: string; }): void; new(): any; }; }; }) {
    try {
        const token = req.headers.authorization || req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: 'You must be logged in to access this resource.' });
        }


        // Verify the JWT and get the email
        // @ts-ignore
        const { email } = jwt.verify(token, 'key');
        console.log(email)

        // Connect to the MongoDB database
        const client = await MongoClient.connect('mongodb+srv://owenoakenheels:4Frozen95@users.cuzqvke.mongodb.net/?retryWrites=true&w=majority');
        const db = client.db('myapp');

        const users = client.db('myapp').collection('users');
        const { name } = req.body;

        // Check if the course already exists
        const user = await users.findOne({ email });

        // @ts-ignore
        const courses = user.courses || [];

        // @ts-ignore
        // Loop through the courses and check if the course already exists
        const courseExists = courses.some((course) => course.name === name);

        if (courseExists) {
            return res.status(400).json({ message: 'Course already exists' });
        }
        const result = await users.findOneAndUpdate(
            { email },
            { $push: { courses: name } }
        );

        // Close the database connection
        await client.close();

        // Send a success response
        res.status(201).json({ message: 'Course created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
}
