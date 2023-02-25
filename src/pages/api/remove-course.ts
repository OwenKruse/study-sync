import {NextApiRequest, NextApiResponse} from "next";
import {MongoClient} from "mongodb";
import jwt from "jsonwebtoken";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
// Connect to the database
        const client = await MongoClient.connect('mongodb+srv://owenoakenheels:4Frozen95@users.cuzqvke.mongodb.net/?retryWrites=true&w=majority');
        const db = client.db('myapp');

// Get the course ID from the request
        const token = req.headers.authorization || req.cookies.token;
        const {course} = req.body;

// Remove the course from the database

        const users = client.db('myapp').collection('users');
        // @ts-ignore
        const { email } = jwt.verify(token, 'key');

        const user = await users.findOne({ email });
        // @ts-ignore
        const courses = user.courses || [];
        //{"_id":{"$oid":"63f32f766f821343f5ba0f8d"},"username":"owenk455","email":"owenoakenheels@gmail.com","password":"$2b$10$RPee/I8ytjNKrQbKtD0IiOMPKAFNlV00WB6/cUxr9chYm8C59u8q6","courses":["Math 2","Spanish 2","Computer Science","Computer Sceince 2","New Class","New Class"]}

        console.log(course);
        const filteredCourses = courses.filter((c: string) => c !== course);

        // Replace the user's courses with the new courses
        await users.findOneAndUpdate({ email }, { $set: { courses: filteredCourses } });

        // Find all the notes for the course
        // @ts-ignore
        const notes = user.notes || [];
        const filteredNotes = notes.filter((n: any) => n.course !== course);

        // Replace the user's notes with the new notes


        await users.findOneAndUpdate(
            { email },
            { $set: { notes: filteredNotes } }
        )



        await client.close();

        res.status(200).json({ message: 'Course removed successfully', courses: filteredCourses });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Server error' });
        }
}




