import { NextApiRequest, NextApiResponse } from 'next'


export default async function transcribe(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { audio } = req.body;
    fetch('https://api.replicate.com/v1/predictions', {
        method: 'POST',
        headers: {
            'Authorization': 'Token ' + '3a4886dd3230e523600d3b555f651dc82aba3a4e',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            version: '30414ee7c4fffc37e260fcab7842b5be470b9b840f2b608f5baa9bbef9a259ed',
            input: {
                audio: audio,
                language: 'en'
            }
        })
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // Every 1 second, check if the transcription is ready
             const interval = setInterval(() => {
                 fetch('https://api.replicate.com/v1/predictions/' + data.id, {
                        headers: {
                            'Authorization': 'Token ' + '3a4886dd3230e523600d3b555f651dc82aba3a4e',
                            'Content-Type': 'application/json'
                        },
                 })
                        .then(response => response.json())
                        .then(data => {
                            console.log(data);
                            if (data.status === 'succeeded') {
                                clearInterval(interval);
                                res.status(200).json({ data });
                        }
                    })
                    .catch(error => console.error(error))
            }, 1000);
        })
        .catch(error => console.error(error))
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
}
