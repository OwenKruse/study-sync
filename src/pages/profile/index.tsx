import {
    JSXElementConstructor,
    Key,
    ReactElement,
    ReactFragment,
    ReactPortal,
    SetStateAction,
    useEffect,
    useState
} from 'react';
import {useRouter} from 'next/router';
import Nav from '../components/Nav'

import {
    Bat,
    Bear,
    Bee,
    Bird,
    Butterfly,
    Cat,
    Cattle,
    Deer,
    Dog,
    Dolphin,
    Duck,
    Eagle,
    Elephant,
    Fish,
    Frog,
    Hippo,
    KoalaBear,
    Monkey,
    Owl,
    Panda,
    Pig,
    Pigeon,
    Rabbit,
    Whale,
} from '@icon-park/react';
import {Box, Button, Container, Divider, Grid, List, ListItem, Paper, TextField, Typography} from "@mui/material";

export default function Profile() {
    const router = useRouter();
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
        }
        // Get the user's profile data
        const json = fetch('/api/get-profile', {
                // @ts-ignore
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token,
                }
            }
        ).then(res => res.json())
            .then(data => {
                    if (data.error) {
                        router.push('/');
                    } else {
                        setProfile(data.user);
                    }
                }
            );
        // @ts-ignore
    }, [router]);
    const [profile, setProfile] = useState(null);
    console.log(profile);
    const Animals = {
        'bat': <Bat theme="outline" size="24"/>,
        'bear': <Bear theme="outline" size="24"/>,
        'bee': <Bee theme="outline" size="24"/>,
        'bird': <Bird theme="outline" size="24"/>,
        'butterfly': <Butterfly theme="outline" size="24"/>,
        'cat': <Cat theme="outline" size="24"/>,
        'cattle': <Cattle theme="outline" size="24"/>,
        'deer': <Deer theme="outline" size="24"/>,
        'dog': <Dog theme="outline" size="24"/>,
        'dolphin': <Dolphin theme="outline" size="24"/>,
        'duck': <Duck theme="outline" size="24"/>,
        'eagle': <Eagle theme="outline" size="24"/>,
        'elephant': <Elephant theme="outline" size="24"/>,
        'fish': <Fish theme="outline" size="24"/>,
        'frog': <Frog theme="outline" size="24"/>,
        'hippo': <Hippo theme="outline" size="24"/>,
        'koala': <KoalaBear theme="outline" size="24"/>,
        'monkey': <Monkey theme="outline" size="24"/>,
        'owl': <Owl theme="outline" size="24"/>,
        'panda': <Panda theme="outline" size="24"/>,
        'pig': <Pig theme="outline" size="24"/>,
        'pigeon': <Pigeon theme="outline" size="24"/>,
        'rabbit': <Rabbit theme="outline" size="24"/>,
        'whale': <Whale theme="outline" size="24"/>,
    }

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [confirmPassword2, setConfirmPassword2] = useState('');

    const changePassword = async (password: string, confirmPassword: string, confirmPassword2: string) => {
        console.log(password, confirmPassword, confirmPassword2)
        // @ts-ignore

        if (confirmPassword === confirmPassword2) {
            // @ts-ignore
            const json = fetch('/api/change-password', {
                method: 'POST',
                // @ts-ignore
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token'),
                },
                body: JSON.stringify({
                    password: confirmPassword,
                    // @ts-ignore
                    email: profile.email,
                    oldPassword: password,
                })
            }).then(res => res.json())
                .then(data => {
                    if (data.error) {
                        alert(data.error);
                    }
                    // Check if the status code is 200
                    else if (data.status === 200) {
                        alert('Password changed successfully!');
                        // Remove the token from local storage
                        localStorage.removeItem('token');
                        router.push('/');
                    } else {
                        alert('The old password is incorrect!');
                    }
                });
        } else {
            alert('Passwords do not match!');
        }
    }

    const deleteProfile = async () => {
        // @ts-ignore
        const json = fetch('/api/delete-profile', {
            method: 'POST',
            // @ts-ignore
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token'),
            },
            body: JSON.stringify({
                // @ts-ignore
                email: profile.email,
            })
        }).then(res => res.json())
            .then(data => {
                if (data.error) {
                    alert(data.error);
                }
                // Check if the status code is 200
                else if (data.status === 200) {
                    alert('Profile deleted successfully!');
                    // Remove the token from local storage
                    localStorage.removeItem('token');
                    router.push('/');
                } else {
                    alert('Something went wrong!');
                }
            });
    }

    const [color, setColor] = useState('#000000');


    const handleChange = (event: any, newValue: SetStateAction<string>) => {
        setColor(newValue);
    };

    const rainbow = [
        '#FF0000',
        '#FF7F00',
        '#FFFF00',
        '#00FF00',
        '#0000FF',
        '#4B0082',
        '#9400D3',
    ];


    // @ts-ignore
    // @ts-ignore
    return (
        <div>
            <Nav/>
            <Box sx={{flexGrow: 1, paddingTop: '5rem'}}>
                <Grid container spacing={2}>
                    <Grid item xs={2}>
                        <Paper
                            sx={{p: 2, display: 'flex', flexDirection: 'column', alignContent: 'center'}}>
                            <Typography variant="h6" component="h2" sx={
                                {
                                    textAlign: 'center',
                                }
                            }>
                                Courses
                            </Typography>
                            <Divider/>
                            <List sx={
                                {
                                    overflow: 'auto',
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                }
                            }>
                                {// @ts-ignore
                                    profile?.courses.map((course: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment | ReactPortal | null | undefined, index: Key | null | undefined) => (
                                    <ListItem key={index} sx={
                                        {
                                            display: 'flex',
                                            flexDirection: 'column',
                                        }
                                    }>
                                        <Typography variant="body1" component="p">
                                            {course}
                                        </Typography>
                                        <Divider/>
                                         <List>
                                                {
                                            // Loop through the users notes and check if the notes course is equal to the course name and if so, add it to the list
                                            // @ts-ignore
                                            profile?.notes.map((note: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment | ReactPortal | null | undefined, index: Key | null | undefined) => {
                                                // @ts-ignore
                                                if (note.course === course) {
                                                    return (
                                                        <ListItem key={index}>
                                                            <Typography variant="body1" component="p">
                                                                {   // @ts-ignore
                                                                    note.title}
                                                            </Typography>
                                                        </ListItem>
                                                    )
                                                }
                                            })
                                            }
                                        </List>
                                    </ListItem>
                                ))}
                            </List>
                        </Paper>
                    </Grid>
                    <Grid item xs={10}>
                        <Paper
                            sx={{p: 2, display: 'flex', flexDirection: 'column', alignContent: 'center'}}>
                            <Typography variant="h6" component="h2" sx={
                                {
                                    textAlign: 'center',
                                }
                            }>
                                Profile
                            </Typography>
                            <Divider/>
                            <Container sx={
                                {
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignContent: 'center',
                                    justifyContent: 'space-evenly',
                                    paddingTop: '1rem',

                                }
                            }>
                                <Typography variant="body1" component="p">
                                    Username: {
                                    // @ts-ignore
                                    profile?.username}
                                </Typography>
                                <Typography variant="body1" component="p">
                                    Email: {
                                    // @ts-ignore
                                    profile?.email}
                                </Typography>
                            </Container>
                            <Container sx={
                                {
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignContent: 'center',
                                    justifyContent: 'space-evenly',
                                }
                            }>
                                <Box sx={
                                    {
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignContent: 'center',
                                        justifyContent: 'space-evenly',
                                        paddingTop: '1rem',
                                        width : '40%',
                                    }
                                }>
                                    <Typography variant="body1" component="p" sx={
                                        {
                                            textAlign: 'center',
                                        }
                                    }>
                                        Change Profile Picture
                                    </Typography>
                                    {/*<List sx={*/}
                                    {/*    {*/}
                                    {/*        display: 'flex',*/}
                                    {/*        flexDirection: 'row',*/}
                                    {/*        alignContent: 'center',*/}
                                    {/*        justifyContent: 'space-evenly',*/}
                                    {/*        flexWrap: 'wrap',*/}
                                    {/*        overflow: 'scroll',*/}
                                    {/*        // Outile the list*/}
                                    {/*        border: '1px solid black',*/}
                                    {/*        // Set the height of the list*/}
                                    {/*        height: '20rem',*/}

                                    {/*    }*/}
                                    {/*}>*/}
                                    {/*    {*/}
                                    {/*        // @ts-ignore*/}
                                    {/*        // Map through the animals object and return a list item with the animal icon. Map the animals so that it is 3 per list item*/}
                                    {/*        Object.keys(Animals).map((animal, index) => {*/}
                                    {/*            if (index % 3 === 0) {*/}
                                    {/*                // @ts-ignore*/}
                                    {/*                return (*/}
                                    {/*                    <ListItem key={index} sx={*/}
                                    {/*                        {*/}
                                    {/*                            display: 'flex',*/}
                                    {/*                            flexDirection: 'row',*/}
                                    {/*                            alignContent: 'center',*/}
                                    {/*                            justifyContent: 'space-evenly',*/}
                                    {/*                            padding: '1rem',*/}
                                    {/*                        }*/}
                                    {/*                    }>*/}
                                    {/*                        <IconButton onClick={() => {*/}
                                    {/*                            // @ts-ignore*/}
                                    {/*                            setProfile({...profile, profilePicture: animal})*/}
                                    {/*                        }*/}
                                    {/*                        }>*/}

                                    {/*                            {*/}
                                    {/*                                // @ts-ignore*/}
                                    {/*                                Animals[animal]}*/}
                                    {/*                        </IconButton>*/}
                                    {/*                        <IconButton onClick={() => {*/}
                                    {/*                            // @ts-ignore*/}
                                    {/*                            setProfile({...profile, profilePicture: animal})*/}
                                    {/*                        }*/}
                                    {/*                        }>*/}
                                    {/*                            {*/}
                                    {/*                                // @ts-ignore*/}
                                    {/*                                Animals[Object.keys(Animals)[index + 1]]}*/}
                                    {/*                        </IconButton>*/}
                                    {/*                        <IconButton onClick={() => {*/}
                                    {/*                            // @ts-ignore*/}
                                    {/*                            setProfile({...profile, profilePicture: animal})*/}
                                    {/*                        }*/}
                                    {/*                        }>*/}
                                    {/*                            {*/}
                                    {/*                                // @ts-ignore*/}
                                    {/*                                Animals[Object.keys(Animals)[index + 2]]}*/}
                                    {/*                        </IconButton>*/}
                                    {/*                    </ListItem>*/}
                                    {/*                )*/}
                                    {/*            }*/}
                                    {/*        })*/}
                                    {/*    }*/}
                                    {/*</List>*/}
                                </Box>
                                <Box sx={
                                    {
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignContent: 'center',
                                        justifyContent: 'flex-start',
                                        paddingTop: '1rem',
                                        width : '50%',
                                    }
                                }>
                                    <Typography variant="body1" component="p" sx={
                                        {
                                            textAlign: 'center',
                                        }
                                    }>
                                        Change Password
                                    </Typography>
                                    <Container sx={
                                        {
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignContent: 'space-evenly',
                                            justifyContent: 'space-evenly',
                                            paddingTop: '1rem',
                                            // Space by 1 rem
                                            '& > :not(style)': {m: 1},
                                        }
                                    }>
                                        <TextField
                                            id="outlined-password-input"
                                            label="Current Password"
                                            type="password"
                                            color={"secondary"}
                                            autoComplete="current-password"
                                            variant="outlined"
                                            onChange={(e) => {
                                                setPassword(e.target.value)
                                            }
                                            }
                                        />
                                        <TextField
                                            id="outlined-password-input"
                                            label="New Password"
                                            type="password"
                                            color={"secondary"}
                                            autoComplete="current-password"
                                            variant="outlined"
                                            onChange={(e) => {
                                                setConfirmPassword(e.target.value)
                                            }
                                            }
                                        />
                                        <TextField
                                            id="outlined-password-input"
                                            label="Confirm New Password"
                                            type="password"
                                            color={"secondary"}
                                            autoComplete="current-password"
                                            variant="outlined"
                                            onChange={(e) => {
                                                setConfirmPassword2(e.target.value)
                                            }
                                            }
                                        />
                                        <Button variant="contained" color={'warning'} sx={
                                            {
                                                justifySelf: 'center',
                                                alignSelf: 'center',
                                            }
                                        } onClick={() => {
                                            // @ts-ignore
                                            changePassword(password, confirmPassword, confirmPassword2)
                                        }
                                        }>
                                            Change Password
                                        </Button>
                                    </Container>
                                    <Box sx={{
                                        pt: 4,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignContent: 'flex-end',
                                        justifyContent: 'flex-end',
                                        height: '100%',

                                    }}>
                                        <Container sx={
                                            {
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignContent: 'flex-end',
                                                justifyContent: 'center',
                                                width : '100%',
                                            }
                                        }>
                                            <Button variant="contained" color={'error'} sx={
                                                {
                                                    width: '35%',
                                                    justifySelf: 'center',
                                                    alignSelf: 'center',
                                                }
                                            } onClick={() => {
                                                // @ts-ignore
                                                deleteProfile(profile)
                                            }
                                            }>
                                                Delete Profile
                                            </Button>
                                        </Container>
                                    </Box>
                                </Box>
                            </Container>
                        </Paper>
                 </Grid>

                </Grid>

            </Box>
        </div>
    );
}