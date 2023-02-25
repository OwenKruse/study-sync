import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import {
    Button,
    Typography,
    Container,
    Box,
    Grid,
    Paper,
    List,
    ListItem,
} from "@mui/material";

import {Link, RichTextEditor} from '@mantine/tiptap';
import { useEditor} from '@tiptap/react';
import Highlight from '@tiptap/extension-highlight';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Superscript from '@tiptap/extension-superscript';
import SubScript from '@tiptap/extension-subscript';
import {useEffect, useRef, useState} from 'react';
import {MantineProvider} from '@mantine/core';
import TranscriptionComponent from "./api/Exstension";
import Nav from "./components/Nav";
export default function Home() {
    const content = '<p>Start typing here...</p>';
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link,
            Superscript,
            TranscriptionComponent,
            SubScript,
            Highlight,
            TextAlign.configure({types: ['heading', 'paragraph']}),
        ],
        editorProps: {
            handleDOMEvents: {
                drop: (view, event) => { event.preventDefault();
                    // @ts-ignore
                    const text = event.dataTransfer.getData('text/plain');
                    event.preventDefault();
                    // @ts-ignore
                    view.dispatch(view.state.tr.replaceSelectionWith(view.state.schema.nodes.reactComponent.create({text})));

                },
            },
        },
        content,
    });

    const [transcribeStyle, setTranscribeStyle] = useState('outlined');
    const [transcribeButtonText, setTranscribeButtonText] = useState('Transcribe');
    const [recording, setRecording] = useState(false);


    const handleTranscribe = () => {
        if (firstTranscribeClick) {
            setFirstTranscribeClick(false);
            setTranscribeStyle('contained');
            setTranscribeButtonText('Recording');
            setRecording(true);
            getAudio();
        }
        else if (!firstTranscribeClick) {
            setTranscribeStyle('outlined');
            setTranscribeButtonText('Transcribe');
            setRecording(false);
            setFirstTranscribeClick(true);
        }

    }
    const transcribe = async (audio: any) => {
        await fetch('/api/get-transcription', {
            method: 'POST',
            // @ts-ignore
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
                for (let i = 0; i < data.data.output.segments.length; i++) {
                    // @ts-ignore
                    setTranscriptions((prev) => [...prev, data.data.output.segments[i].text]);
                }
            });
    }


    const [transcriptions, setTranscriptions] = useState(['The mitochondria is the powerhouse of the cell.', 'We exist in a world of constant change.', ' The time is now to make a change.']);
    const [firstTranscribeClick, setFirstTranscribeClick] = useState(true);
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

                }, 15000);
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
            }, 15000);
        }

        return () => clearInterval(interval);
    }, [recording]);

    const listRef = useRef<HTMLUListElement>(null);

    useEffect(() => {
        if (listRef.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight;
        }
    }, [transcriptions]);
    const paperRef = useRef<HTMLDivElement>(null);
    // @ts-ignore
  return (
      <div>
        <Head>
          <title>StudySync</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </Head>
        <Nav/>

          <Box sx={{
              flexGrow: 1,
          }}>
                <Grid container >
                    <Grid item xs={12}>
                        <Paper sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            // Center the content vertically and horizontally
                            paddingTop: '2rem',
                            justifyContent: 'center',
                            alignItems: 'center',
                            minHeight: '70vh',
                            // Background that is split in half diagonally
                            background: 'linear-gradient(147deg, rgba(0,173,181,1) 40%, rgba(34,40,49,1) 40%)'

                        }}>
                            <Grid sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                // Center the content vertically and horizontally
                                justifyContent: 'center',
                                alignItems: 'center',

                            }
                            }>
                                <Typography variant="h3" sx={{
                                    color: '#ffffff',
                                    fontWeight: 'bold',
                                    // underline the text with 00ADB5
                                    textDecoration: 'underline',
                                    textDecorationColor: '#00ADB5',
                                }
                                }>
                                    StudySync
                                </Typography>
                                <Typography variant="h5" sx={{
                                    color: '#ffffff',
                                    fontWeight: 'bold',
                                    paddingTop: '1rem',
                                }
                                }>
                                    The note taking app for the modern student
                                </Typography>
                                <Grid item sx={
                                    {
                                        paddingTop: '1rem',
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        alignItems: 'space-around',
                                    }
                                }
                                >
                                    <Button variant="outlined"
                                    onClick={() => {
                                        window.location.href = '/signup';
                                    }}
                                            color={"secondary"} sx={{
                                        color: '#ffffff',
                                        fontWeight: 'bold',
                                        marginRight: '1rem',
                                        ":hover": {
                                            backgroundColor: '#00ADB5',
                                            // grow the button on hover slowly
                                            transition: 'transform 0.3s',
                                            transform: 'scale(1.05)',
                                        }
                                    }}>
                                        Get Started
                                    </Button>
                                    <Button variant="outlined" color={"warning"}
                                            onClick={() => {
                                                window.scrollTo({
                                                    top: paperRef.current?.offsetTop,
                                                    behavior: 'smooth',
                                                });
                                            }}

                                            sx={{
                                        color: '#ffffff',
                                        fontWeight: 'bold',
                                        ":hover": {
                                            // grow the button on hover slowly
                                            transition: 'transform 0.3s',
                                        }
                                    }}>
                                        Learn More
                                    </Button>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper

                            ref={paperRef}
                            sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            // Center the content vertically and horizontally
                            justifyContent: 'center',
                            alignItems: 'center',
                            minHeight: '100vh',
                            background: 'linear-gradient(24deg, rgba(34,40,49,1) 50%, rgba(57,62,70,1) 50%)'

                        }
                        }>
                            <Typography variant="h3" sx={{
                                color: '#EEEEEE',
                                fontWeight: 'bold',
                                paddingTop: '5rem',
                                // underline the text with 00ADB5
                                paddingBottom: '2rem',
                            }
                            }>
                                Your notes, wherever you are.
                            </Typography>

                            <Grid container sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                // Center the content vertically and horizontally
                                justifyContent: 'center',
                                alignItems: 'center',
                                minHeight: '50vh',
                                width: '100%',
                            }
                            }>
                                <Grid item xs={2} sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    // Center the content vertically and horizontally
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }
                                }>
                                    <Container sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        // Center the content vertically and horizontally
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        // Make the container the shape of a phone
                                        borderRadius: '1rem',
                                        // Give the container a shadow
                                        boxShadow: 3,
                                        position: 'relative',
                                        width: '15em',
                                        height: '30em',
                                        border: '1px solid #00ADB5',
                                        overflow: 'hidden',

                                    }
                                    }>
                                    <Image src={'/../public/Screen Shot 2023-02-24 at 14.16.40.png'} alt={'StudySync'} fill={true}/>
                                    </Container>
                                </Grid>
                                <Grid item xs={7} sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    // Center the content vertically and horizontally
                                    justifyContent: 'center',
                                    alignItems: 'center',

                                }}>
                                    <Container sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        // Center the content vertically and horizontally
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        width: '50em',
                                        height: '30em',
                                        border: '1px solid #00ADB5',
                                        overflow: 'hidden',
                                        position: 'relative',
                                        // Make the container the shape of a phone
                                        borderRadius: '1rem',
                                        // Give the container a shadow
                                        boxShadow: 3,
                                    }
                                    }>
                                    <Image src={'/../public/E970257C-2486-46E6-BE0A-1434A2AEF575.jpeg'} alt={'Computer'} fill={true}/>
                                    </Container>
                                </Grid>
                            </Grid>

                            <Grid container sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                // Center the content vertically and horizontally
                                justifyContent: 'center',
                                alignItems: 'center',
                                minHeight: '50vh',
                                width: '100%',
                                paddingBottom: '5rem',
                                paddingTop: '5rem',
                            }
                            }>
                                <Typography variant="h4" sx={{
                                    color: '#EEEEEE',
                                    fontWeight: 'bold',
                                    paddingTop: '2rem',
                                    // underline the text with 00ADB5
                                    paddingBottom: '2rem',
                                }
                                }>
                                    Be sure your getting everything from your meetings, lectures, and presentations.
                                </Typography>
                                <Grid item xs={7} sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    // Center the content vertically and horizontally
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                    <Container sx={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        overflow: 'hidden',
                                        width: '100%',
                                        position: 'relative',
                                    }}>
                                        <MantineProvider theme={{ colorScheme: 'dark' }}>
                                            <div style={
                                                {
                                                    display: 'flex',
                                                    width: '100%',
                                                    flexDirection: 'row',
                                                    overflow: 'hidden',
                                                    position: 'relative',
                                                    border: '1px solid #00ADB5',
                                                    borderRadius: '1rem',


                                                }
                                            }>
                                            <RichTextEditor editor={editor}
                                                            sx={
                                                                {
                                                                    height: '100%',
                                                                }
                                                            }>
                                                <RichTextEditor.Toolbar   sx={
                                                    {
                                                        top: '0',
                                                        left: '0',
                                                        right: '0',
                                                        zIndex: 1,
                                                    }
                                                }>

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
                                                    } color={'secondary'}

                                                            // @ts-ignore
                                                            variant={transcribeStyle}>{transcribeButtonText}</Button>




                                                </RichTextEditor.Toolbar>

                                                <RichTextEditor.Content
                                                    onDrop={event => {
                                                        event.preventDefault();
                                                    }}

                                                    sx={
                                                        {
                                                            minHeight: '50vh',

                                                        }
                                                    }/>


                                            </RichTextEditor>
                                                <Box sx={{
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'flex-start',
                                                    width: '20vw',
                                                    backgroundColor: '#383838',

                                                }}>
                                                    <List sx={
                                                        {
                                                            paddingTop: '5rem',
                                                            width: '100%',
                                                            overflow: 'auto',
                                                            maxHeight: '100vh',

                                                        }
                                                    }
                                                          ref={listRef}
                                                    >


                                                        {transcriptions.map((transcription, index) => {
                                                            return (
                                                                <ListItem key={index} sx={
                                                                    {
                                                                        width: '100%',
                                                                    }
                                                                }>
                                                                    <Box
                                                                        draggable={true}
                                                                        onDragStart={(e) => {
                                                                            e.dataTransfer.setData('text/plain', transcription);
                                                                        }}
                                                                        sx={
                                                                            {
                                                                                display: 'flex',
                                                                                flexDirection: 'column',
                                                                                justifyContent: 'center',
                                                                                alignItems: 'center',
                                                                                backgroundColor: '#262626',
                                                                                padding: '.75rem',
                                                                                borderRadius: '10px',
                                                                                width: '100%',
                                                                                cursor: 'pointer',
                                                                            }
                                                                        }>
                                                                        <Typography sx={
                                                                            {
                                                                                fontSize: '.85rem',
                                                                                fontWeight: '500',
                                                                                color: '#e1e1e1',
                                                                            }
                                                                        }>{transcription}</Typography>
                                                                    </Box>
                                                                </ListItem>
                                                            )
                                                        })}
                                                    </List>
                                                </Box>
                                            </div>
                                        </MantineProvider>

                                    </Container>

                                </Grid>
                                <Grid container xs={2} sx={{
                                    display: 'flex',
                                    flexDirection: 'column',

                                }}>

                                        <Typography sx={
                                            {
                                                paddingTop: '5rem',
                                                fontSize: '1rem',
                                                fontWeight: '600',
                                                color: '#e1e1e1',
                                            }
                                        }>
                                            Everything from your meeting, lecture, or presentation is transcribed right here.
                                        </Typography>

                                    <Typography sx={
                                        {
                                            paddingTop: '5rem',
                                            fontSize: '1rem',
                                            fontWeight: '600',
                                            color: '#e1e1e1',
                                            paddingBottom: '15rem',
                                        }
                                    }>
                                        Drag and drop the import things right into your notes.
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>

      </div>
  );
}