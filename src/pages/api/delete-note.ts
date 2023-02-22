import {NextApiRequest, NextApiResponse} from "next";
import {MongoClient} from "mongodb";
import jwt from "jsonwebtoken";

export default async function deleteNote(req: NextApiRequest, res: NextApiResponse) {
    try {
    const token = req.headers.authorization || req.cookies.token;
    const {id} = req.body;
    if (!token) {
        return res.status(401).json({ message: 'You must be logged in to access this resource.' });
    }
    // Connect to the MongoDB database
    const client = await MongoClient.connect('mongodb+srv://owenoakenheels:4Frozen95@users.cuzqvke.mongodb.net/?retryWrites=true&w=majority');

    const users = client.db('myapp').collection('users');

    // Get the user's email from the JWT token
    // @ts-ignore
    const { email } = jwt.verify(token, 'key');

    // Get the user's notes from the database

    // @ts-ignore
    const user = await users.findOne({ email });
    // @ts-ignore
    let noteToEdit;
    let notes = user.notes;
    // @ts-ignore
    for (let i = 0; i < user.notes.length; i++) {
        // @ts-ignore
        if (user.notes[i].id == id) {
            noteToEdit = user.notes[i];
            notes.splice(i, 1);
        }
    }

    // @ts-ignore
    const result = await users.findOneAndUpdate({email}, {$set: {notes: notes}});

    // Close the database connection
    await client.close();

    // Send the updated note as the response
    res.status(200).json({ note: { id } });

}
    catch (e) {
        res.status(500).json({ message: 'Something went wrong.' + e });
    }
}