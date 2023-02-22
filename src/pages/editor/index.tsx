import { RichTextEditor, Link } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import Highlight from '@tiptap/extension-highlight';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Superscript from '@tiptap/extension-superscript';
import SubScript from '@tiptap/extension-subscript';
import {MouseEvent, useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import Nav from '../components/Nav';
import {MantineProvider} from '@mantine/core';
import {Button} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


// @ts-ignore
export default function Editor({ id, notes}) {
    // Sourt the notes and find the one with the same id as the one in the url
    const note = notes.notes.sort((a: { id: number; }, b: { id: number; }) => a.id - b.id).find((note: { id: number; }) => note.id === parseInt(id));
    const content = note.content;

    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link,
            Superscript,
            SubScript,
            Highlight,
            TextAlign.configure({types: ['heading', 'paragraph']}),
        ],
        content,
    });
    const [text, setText] = useState(content);
    // Every time the editor changes and then doesnt change for 30 seconds, update the content
    if (editor) {
        editor.on('update', ({editor}) => {
            text !== editor.getHTML() && setText(editor.getHTML());
        });
    }

    useEffect(() => {
            const timer = setTimeout(() => {
                if (text !== content) {
                    fetch('http://localhost:3000/api/edit-note', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: localStorage.getItem('token')
                        },
                        body: JSON.stringify({
                            id,
                            content: text,
                        }),
                    });
                }
            }, 3000);
            return () => clearTimeout(timer);
        }
        , [text, content, id]);

    const router = useRouter();

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            router.push('/app');
        }
    }, [router]);

    const [recording, setRecording] = useState(false);

    const transcribe = async (audio: any) => {
        await fetch('/api/get-transcription', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: localStorage.getItem('token')
            },
            body: JSON.stringify({
                audio,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data.data);
                let text = '';
                for (let i = 0; i < data.data.output.segments.length; i++) {
                    text += data.data.output.segments[i].text + ' ';
                }
                editor?.chain().focus().insertContent(text).run();
            });
    }

    const [firstClick, setFirstClick] = useState(true);
    const [style, setStyle] = useState('outlined');

    const handleGoBack = () => {
        if (firstClick) {
            setFirstClick(false);
            setStyle('contained');

            setTimeout(() => {
                setFirstClick(true);
                setStyle('outlined');
            }, 3000);
        } else {
            router.push(`/app`);
        }
    }

    const [firstTranscribeClick, setFirstTranscribeClick] = useState(true);
    const [transcribeStyle, setTranscribeStyle] = useState('outlined');
    const [transcribeButtonText, setTranscribeButtonText] = useState('Transcribe');



    const handleTranscribe = () => {
        if (firstTranscribeClick) {
            setFirstTranscribeClick(false);
            setTranscribeStyle('contained');
            setTranscribeButtonText('Recording');
            setRecording(true);
        }
        else if (!firstTranscribeClick) {
            setTranscribeStyle('outlined');
            setTranscribeButtonText('Transcribe');
            setRecording(false);
            setFirstTranscribeClick(true);
            }

        }

                const getAudio = () => {
                    let chunks: BlobPart[] | undefined = [];
                    let mediaRecorder: MediaRecorder | null = null;

                    navigator.mediaDevices.getUserMedia({audio: true})
                        .then(function (stream) {
                            mediaRecorder = new MediaRecorder(stream);

                            mediaRecorder.ondataavailable = function (e) {
                                // @ts-ignore
                                chunks.push(e.data);
                            }

                            mediaRecorder.onstop = function () {
                                const blob = new Blob(chunks, {type: 'audio/wav'});
                                chunks = [];
                                const reader = new FileReader();
                                reader.readAsArrayBuffer(blob);
                                reader.onload = function () {
                                    // @ts-ignore
                                    const base64Data = btoa(String.fromCharCode.apply(null, new Uint8Array(reader.result)));
                                    const audioURL = 'data:audio/wav;base64,' + base64Data;
                                    transcribe(audioURL);
                                }
                            }

                            mediaRecorder.start();

                            setTimeout(function () {
                                // @ts-ignore
                                mediaRecorder.stop();
                                console.log(recording)

                            }, 5000);
                        })
                        .catch(function (err) {
                            console.log('The following error occurred: ' + err);
                        });
                    return mediaRecorder;

                }

    useEffect(() => {
        let interval: any;

        if (recording) {
            interval = setInterval(() => {
                getAudio();
            }, 5000);
        }

        return () => clearInterval(interval);
    }, [recording]);


    // @ts-ignore
    return (
            <div>
                <MantineProvider theme={{ colorScheme: 'dark' }}>
                <RichTextEditor editor={editor}>
                <RichTextEditor.Toolbar   sx={
                    {
                        position: 'fixed',
                        top: '0',
                        left: '0',
                        right: '0',
                        zIndex: 1,
                        padding: '1rem',
                    }
                }>
                    <Button onClick={handleGoBack} sx={
                        {
                            width: '10px',

                        }
                    } color={'warning'} variant={style}>
                        <ArrowBackIcon/>
                    </Button>
                    <RichTextEditor.ControlsGroup>
                    <RichTextEditor.Bold />
                    <RichTextEditor.Italic />
                    <RichTextEditor.Underline />
                    <RichTextEditor.Strikethrough />
                    <RichTextEditor.ClearFormatting />
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                    <RichTextEditor.H1 />
                    <RichTextEditor.H2 />
                    <RichTextEditor.H3 />
                    <RichTextEditor.H4 />
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                    <RichTextEditor.Blockquote />
                    <RichTextEditor.Hr />
                    <RichTextEditor.BulletList />
                    <RichTextEditor.OrderedList />
                    <RichTextEditor.Subscript />
                    <RichTextEditor.Superscript />
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                    <RichTextEditor.Link />
                    <RichTextEditor.Unlink />
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                    <RichTextEditor.AlignLeft />
                    <RichTextEditor.AlignCenter />
                    <RichTextEditor.AlignJustify />
                    <RichTextEditor.AlignRight />
                    </RichTextEditor.ControlsGroup>
                    <Button onClick={handleTranscribe} sx={
                        {
                            marginLeft: 'auto',
                        }
                    } color={'secondary'} variant={transcribeStyle}>{transcribeButtonText}</Button>




                    </RichTextEditor.Toolbar>

                    <RichTextEditor.Content sx={
                        {
                            paddingTop: '4rem',
                            minHeight: '100vh',

                        }
                    }/>


                </RichTextEditor>
                </MantineProvider>
            </div>
);
}

export async function getServerSideProps(context: { query: { course: any; id: any; token: any; }; }) {
    const { course, id, token } = context.query;
    console.log(course, id, token)


    const notes = await fetch('http://localhost:3000/api/get-notes', {
        method: 'POST',
        // @ts-ignore
        headers: {
            'Content-Type': 'application/json',
            Authorization: token,
        },
        body: JSON.stringify({ course }),
        credentials: 'include',
    })
        .then((response) => response.json())
        .then((data) => {
            return data;
        });

    console.log(notes)
    return {
        props: {
            course: course,
            id: id,
            notes: notes,
        },

    };
}

