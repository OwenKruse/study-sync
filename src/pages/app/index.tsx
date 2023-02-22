import Nav from '../components/Nav'
import {
    Button,
    Typography,
    Container,
    Box,
    Grid,
    Paper,
    TextField,
    InputLabel,
    Select,
    MenuItem,
    FormControl,
    FormHelperText,
    InputAdornment,
    IconButton,
    OutlinedInput,
    InputBase,
    Tooltip,
    Divider,
    List,
    ListItem, ListItemText, SelectChangeEvent, Modal,


} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import React, {useEffect, useState} from 'react'
import { useRouter } from 'next/router';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
export default function Dashboard() {


    const router = useRouter();
    const [course, setCourse] = useState('');
    const [courses, setCourses] = useState([]);
    const [name, setName] = useState('');
    const [firstClick, setFirstClick] = useState(true);
    const [shouldUpdate, setShouldUpdate] = useState(false);
    const [disabled, setDisabled] = useState(true);
    const [courseName, setCourseName] = useState('');
    const [currentButtonVariant, setCurrentButtonVariant] = useState('contained');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [notes, setNotes] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
        }
    fetch('/api/get-courses', {
        method: 'GET',
        // @ts-ignore
        headers: {
            'Content-Type': 'application/json',
            Authorization: token,
        },
        credentials: 'include',
    })
        .then((response) => response.json())
        .then((data) => {
            setCourses(data.courses);
        })
        .catch((error) => console.log(error));



        fetch('/api/get-notes', {
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
                setNotes(data.notes);
            })
            .catch((error) => console.log(error));
        }, [disabled, shouldUpdate]);

        const handleAdd = () => {
            if (name === '') {
                return;
            }
            const token = localStorage.getItem('token');
            fetch('/api/add-course', {
                method: 'POST',
                // @ts-ignore
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                },
                body: JSON.stringify({ name }),
                credentials: 'include',
            })
                .then((response) => response.json())
                .then((data) => console.log(data))
                .then(() => {
                    fetch('/api/get-courses', {
                        method: 'GET',
                        // @ts-ignore
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: token,
                        },
                        credentials: 'include',
                    })
                        .then((response) => response.json())
                        .then((data) => {
                            setCourses(data.courses);
                            setName('')

                        })
                        .catch((error) => console.log(error));
                })
            // Clear the input field
            setName('');
        };


    // Include the onClick event handler
    const handleRemoveCourse = (event: React.MouseEvent<SVGSVGElement>, course: never) => {
        // If there is only one course, don't allow the user to remove it
        // Change the button text to "Confirm"
        if (firstClick) {
            setFirstClick(false);
            setDeleteColors({
                ...deleteColors,
                [course]: 'error',
            });
            //Timer to change the button text back to "Remove"
            setTimeout(() => {
                setFirstClick(true);
                setDeleteColors({
                    ...deleteColors,
                    [course]: 'inherit',
                });
            }
                , 3000);

            return;
        }


            const token = localStorage.getItem('token');
            fetch('/api/remove-course', {
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
                .then((data) => console.log(data))
                .then(() => {
                    setShouldUpdate(!shouldUpdate);
                    router.reload();
                })
                .catch((error) => console.log(error));

            setFirstClick(true);
            setCourseName('');
    }


    const handleCourseChange = (event: SelectChangeEvent<string>) => {
        setCourseName(event.target.value);
        setCourse(event.target.value);
        setDisabled(false);
    }

    const handleNewNote = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, course: never) => {
        const token = localStorage.getItem('token');
        fetch('/api/new-note', {
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
            .then((data) => console.log(data))
            .then(() => {
                setShouldUpdate(!shouldUpdate);
            })
            .catch((error) => console.log(error));

            }

            const handleNoteClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: any, course: any) => {
                const token = localStorage.getItem('token');
                // Pass the note index and token to the editor page
                router.push({
                    pathname: '/editor',
                    query: { id, course, token },
                });
            }


    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    const [editMode, setEditMode] = useState(false);
    const [deleteColors, setDeleteColors] = useState({});
    const [deleteFirstClick, setDeleteFirstClick] = useState(true);

    function handleDelete(id: any): void {
        if (deleteFirstClick) {
            setDeleteColors({
                ...deleteColors,
                [id]: 'error',
            });
            setDeleteFirstClick(false);

                setTimeout(() => {
                                setDeleteColors({
                                    ...deleteColors,
                                    [id]: 'inherit',
                                });
                                setDeleteFirstClick(true);
                            }
                , 3000);
            return;
        }


            const token = localStorage.getItem('token');
        fetch('/api/delete-note', {
            method: 'POST',
            // @ts-ignore
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
            body: JSON.stringify({ id }),
            credentials: 'include',
        })
            .then((response) => response.json())
            .then((data) => console.log(data))
            .then(() => {
                setShouldUpdate(!shouldUpdate);
            })
            .catch((error) => console.log(error));

        setDeleteFirstClick(true);

    }



    // @ts-ignore
    return (
        <div style={
            {

            }
        }>
            <Nav />
            <Container maxWidth="xl" sx={
                {
                    paddingTop: "5rem",
                    minHeight: "100vh",
                    width: "100vw",
                }
            }>
                {!isLoggedIn &&
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                    Please login to and refresh the page to view your dashboard
                    </Typography>
                    </Box>
                    }
                {isLoggedIn &&
                <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={2} >
                        <Grid item xs={12} sm={6} md={8} lg={12}>
                            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', width: '100%' }}>
                                <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description" sx={
                                    {
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',

                                    }
                                }>
                                    <Paper sx={{  display: 'flex', flexDirection: 'column', justifySelf:'center', alignSelf:'center', maxWidth:'500px', maxHeight:'500px', overflow:'auto', backgroundColor: '#383838' }}>
                                        <List>
                                            <ListItem>
                                                <TextField id="outlined-basic" color={'secondary'}
                                                           onKeyDown={(e) => e.stopPropagation()}
                                                           label='Add A Course'
                                                           value={name}
                                                           variant="outlined"
                                                           onChange={(e) => setName(e.target.value)}
                                                           sx={
                                                               {
                                                                   width: '100%',
                                                                   marginRight: '10px'
                                                               }
                                                           } />

                                                <Button variant="contained"
                                                        // Handle add and close
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleClose();
                                                            handleAdd();
                                                        }}
                                                        color="secondary" >
                                                    <AddIcon />
                                                </Button>
                                            </ListItem>

                                        </List>

                                    </Paper>

                                </Modal>
                                <Typography variant="h6" component="h2" gutterBottom sx={
                                    {
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                    }
                                }>
                                    Notes
                                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                        <Button variant="outlined" onClick={() => handleClickOpen()
                                        } color="secondary" sx={{  }}>
                                            <CreateNewFolderIcon/>
                                        </Button>
                                    </Box>
                                </Typography>
                                <Divider />
                                <Grid container spacing={2} sx={{
                                    marginTop: '1em',
                                    marginBottom: '1em',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'flex-start',
                                    justifyContent: 'flex-start',



                                }}>
                                    {courses.length > 0 && courses.map((course, index) => (
                                        <Grid item xs={12} sm={6} md={4} lg={3} key={`${course}-${index}`} sx={
                                            {
                                            }
                                        }>

                                                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column',
                                                    backgroundColor: '#2f2e2e'
                                                }}>
                                                    <Typography variant="h6" component="h2" gutterBottom sx={
                                                        {
                                                            display: 'flex',
                                                            flexDirection: 'row',
                                                            alignItems: 'center',
                                                            justifyContent: 'space-between',
                                                        }
                                                    }>
                                                        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                                            {course}
                                                            <DeleteIcon
                                                                color={deleteColors[course] ? deleteColors[course] : 'inherit'}
                                                                sx={{ marginLeft: '10px',
                                                                    cursor: 'pointer',

                                                                }}
                                                                onClick={(e) => handleRemoveCourse(e, course)}
                                                            />
                                                        </Box>

                                                        <Button variant="outlined" onClick={e => handleNewNote(e, course) } color="secondary" sx={{  }}>
                                                            <AddIcon/>
                                                        </Button>
                                                    </Typography>
                                                <List>
                                                    {notes.length > 0 && notes.filter((note) => note.course === course).map((note, index) => (
                                                        <ListItem key={`${note}-${index}`} sx={
                                                            {
                                                                width: '100%',
                                                                display: 'flex',
                                                                flexDirection: 'row',
                                                                alignItems: 'center',
                                                                justifyContent: 'space-between',

                                                            }
                                                        }>

                                                            <Tooltip title={note.content.length < 100 ? note.content : note.content.slice(0, 100) + '...'} placement="top">
                                                            <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%',
                                                                alignItems: 'flex-start',
                                                                justifyContent: 'flex-start',
                                                                cursor: 'pointer',
                                                                backgroundColor: '#2f2e2e',
                                                                padding: '1rem',
                                                                borderRadius: '10px',
                                                                ":hover": {
                                                                    transform: 'scale(1.01)',
                                                                }

                                                            }}
                                                                 onClick={event => handleNoteClick(event, note.id, course)}>
                                                                <Typography variant="h6" component="h2" gutterBottom sx={
                                                                    {
                                                                        display: 'flex',
                                                                        flexDirection: 'row',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'space-between',
                                                                        width: '100%',
                                                                    }
                                                                }>
                                                                    {note.title}

                                                                    <DeleteIcon
                                                                        key={note.id}
                                                                        sx={{ width: '25px' }}
                                                                        color={deleteColors[note.id] || 'default'}
                                                                        onClick={event => {
                                                                            event.stopPropagation();
                                                                            handleDelete(note.id);
                                                                        }}
                                                                    />
                                                                </Typography>
                                                                <Typography variant="body2" component="p" gutterBottom>
                                                                   # {note.id}
                                                                </Typography>

                                                                <Divider />

                                                            </Box>
                                                                </Tooltip>
                                                        </ListItem>
                                                    ))}
                                                </List>
                                                </Paper>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Paper>
                        </Grid>
                    </Grid>
                </Box>
                }
            </Container>
        </div>
    );
}


// The following is the getServerSideProps function that is used to get the token from the cookie




