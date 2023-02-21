import { RichTextEditor, Link } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import Highlight from '@tiptap/extension-highlight';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Superscript from '@tiptap/extension-superscript';
import SubScript from '@tiptap/extension-subscript';
import {useEffect, useState} from 'react';
import { useRouter } from 'next/router';
import Nav from '../components/Nav';
import { MantineProvider  } from '@mantine/core';



export default function Editor({ course, id, notes }) {
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
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
        ],
        content,
    });
    const [text, setText] = useState(content);
    // Every time the editor changes and then doesnt change for 30 seconds, update the content
    if (editor){
    editor.on('update', ({ editor }) => {
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

    const transcribe = () => {
        fetch('https://api.replicate.com/v1/predictions', {
            method: 'POST',
            headers: {
                'Authorization': 'Token ' + '3a4886dd3230e523600d3b555f651dc82aba3a4e',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                version: '30414ee7c4fffc37e260fcab7842b5be470b9b840f2b608f5baa9bbef9a259ed',
                input: {
                    audio: '...'
                }
            })
        })
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.error(error))

    }

    return (
            <div>
                <Nav />
                <MantineProvider theme={{ colorScheme: 'dark' }}>
                <RichTextEditor editor={editor}>
                <RichTextEditor.Toolbar sticky stickyOffset={60} sx={
                    {
                        paddingTop: '1rem',
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

                    </RichTextEditor.Toolbar>

                    <RichTextEditor.Content sx={
                        {
                            paddingTop: '3rem',
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

