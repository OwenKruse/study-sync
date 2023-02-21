import {NextApiRequest, NextApiResponse} from "next";
import {MongoClient} from "mongodb";
import jwt from "jsonwebtoken";
export default async function newNote(req: NextApiRequest, res: NextApiResponse) {
    try {


    // Check if user is authenticated
    const token = req.headers.authorization || req.cookies.token;

    const {course} = req.body;
    // Get today's date
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const today = `${month}/${day}/${year}`;




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

    // Get the user's notes from the database

    // @ts-ignore
    const notes = user.notes || [];

    // @ts-ignore
    const newNote = {
        title: today,
        content: '',
        course: course,
        id: notes.length + 1
    }

    // @ts-ignore
    const result = await users.findOneAndUpdate({email}, {$push: {notes: newNote}});

    // Close the database connection
    await client.close();

    // Send the notes as the response
    res.status(200).json({ notes });


} catch (error) {
    console.error(error);
    }
}
