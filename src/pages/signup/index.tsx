import React, { useState } from 'react';
import Head from 'next/head';
import {TextField, Button, Container, Typography, Box} from '@mui/material';
import { useRouter } from 'next/router';
import {router} from "next/client";


export default function Signup() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const router = useRouter();
    const handleSignup = () => {
        fetch('/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                email,
                password,
            }),
        })
            // Then push to the app page
            .then(() => router.push('/app'))
    };


    return (

        <div style={
            {
                backgroundColor: '#303030',
                minHeight: '100vh',
                width: '100vw',
                position: 'absolute',
            }
        }>

            <Head>
                <title>Sign Up</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Head>
            <Container maxWidth={"sm"} sx={
                {
                    marginTop: "10vh",
                    backgroundColor: '#424242',
                    borderRadius: '10px',
                    padding: '2rem',
                    color: 'white',



                }
            }>
                <Typography variant="h4" align="center" >
                    StudySync
                </Typography>
                <form style={
                    {
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',

                    }
                }>

                    <TextField
                        label="Email"
                        variant="outlined"
                        color="secondary"
                        fullWidth
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', alignItems: 'center' }}>

                        <TextField
                            label="Username"
                            variant="outlined"
                            color="secondary"
                            fullWidth
                            margin="normal"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            sx={
                                {
                                    marginRight: '10px',
                                }
                            }
                        />
                    <TextField
                        label="Password"
                        type="password"
                        variant="outlined"
                        color="secondary"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />



                    </Box>
                    <Button variant="contained" color="primary" sx={{ mt: 5, width: '50%' }} onClick={handleSignup}>
                        Sign Up
                    </Button>
                </form>
            </Container>
        </div>
    );
}