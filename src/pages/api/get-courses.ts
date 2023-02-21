import { ObjectIdLike } from 'bson';
import {MongoClient, ObjectId} from 'mongodb';
import jwt from "jsonwebtoken";

export default async function getCourses(req: { headers: { authorization: any; }; cookies: { token: any; }; userId: string | number | ObjectId | ObjectIdLike | Uint8Array | undefined; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { message?: string; courses?: any; }): void; new(): any; }; }; }) {
    // Check if user is authenticated
    const token = req.headers.authorization || req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'You must be logged in to access this resource.' });
    }


    // Connect to the MongoDB database
    const client = await MongoClient.connect('mongodb+srv://owenoakenheels:4Frozen95@users.cuzqvke.mongodb.net/?retryWrites=true&w=majority');
    const db = client.db('myapp');
    const users = client.db('myapp').collection('users');

    // Get the user's email from the JWT token
    // @ts-ignore
    const { email } = jwt.verify(token, 'key');

    // Get the user's courses from the database
    const user = await users.findOne({ email });

    // @ts-ignore
    const courses = user.courses || [];
    console.log(courses);
    // Close the database connection
    client.close();

    // Send the courses as the response
    res.status(200).json({ courses });
}
