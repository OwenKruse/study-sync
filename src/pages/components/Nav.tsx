import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import {Link, TextField} from "@mui/material";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";


function ResponsiveAppBar() {
    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
    const [anchorElLogin, setAnchorElLogin] = React.useState<null | HTMLElement>(null);
    const [isLogin, setIsLogin] = useState(false);
    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleOpenLogin = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElLogin(event.currentTarget);
    }

    const handleCloseLogin = () => {
        setAnchorElLogin(null);
    }
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const router = useRouter();
    const handleLogin = () => {
        handleCloseLogin();
        fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                password,
            }),
        })
            // Check if the response is 401 Unauthorized and alert the user and skip the rest of the code
            .then((response) => {
                if (response.status === 401) {
                    alert('Invalid email or password. Please try again.')
                    setError(true);
                }
                return response;
            })
            .then((response) => response.json()
            .then((data) => (localStorage.setItem('token', data.token)))
            .then(() => {if (localStorage.getItem('token') && !error)  {
                setIsLogin(true);
                router.push('/app');
            } else {
                setIsLogin(false);
                localStorage.removeItem('token');
                router.reload();
            }

            })
            .catch((error) => {
                console.error('Error:', error);
                setIsLogin(false);
                alert('Invalid email or password. Please try again.')
            }));



        // Refresh the page if the user logs in or out
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLogin(true);
        }
        // Refresh the page if the user logs in or out
    } , []);

    const handleLogout = () => {
        handleCloseUserMenu();
        localStorage.removeItem('token');
        setIsLogin(false);
        router.push('/');
    }

    const handleProfile = () => {
        handleCloseUserMenu();
        router.push('/profile');
    }


    return (
        <AppBar position="absolute">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        StudySync
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none', isLogin: 'none' },
                            }}
                        >
                            {!isLogin && (
                                <MenuItem  onClick={() => router.push('/app')}>
                                    <Typography textAlign="center">Dashboard</Typography>
                                </MenuItem>
                            )}
                        </Menu>
                    </Box>
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href=""
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        StudySync
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                            <Button
                                onClick={() => router.push('/app')}
                                sx={{ my: 2, color: 'white', display: 'block' }}
                            >
                                <Typography textAlign="center">Dashboard</Typography>
                            </Button>
                    </Box>

                        {!isLogin && (
                            <Box sx={{ flexGrow: 0 }}>
                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={handleOpenLogin}
                                sx={{ my: 2, color: 'white', display: 'block' }}
                            >
                                Login
                            </Button>
                                <Menu
                                    sx={{ mt: '45px' }}
                                    id="menu-appbar"
                                    anchorEl={anchorElLogin}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }
                                    }
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={Boolean(anchorElLogin)}
                                    onClose={handleCloseLogin}
                                >
                                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                                    <TextField
                                        id="outlined-basic"
                                        label="Email"
                                        color={"secondary"}
                                        variant="outlined"
                                        onChange={(e) => setEmail(e.target.value)}
                                        sx={{ m: 1, width: '25ch' }}
                                    />
                                    <TextField
                                        id="outlined-password-input"
                                        label="Password"
                                        type="password"
                                        onChange={(e) => setPassword(e.target.value)}
                                        color={"secondary"}
                                        autoComplete="current-password"
                                        variant="outlined"
                                        sx={{ m: 1, width: '25ch' }}
                                    />
                                    <Button
                                        variant="contained"
                                        onClick={handleLogin}
                                        sx={{  color: 'white', display: 'block' }}
                                    >
                                        Login
                                    </Button>
                                    <Typography variant={
                                        "body2"
                                    }  sx={{ m: 1, color: 'white' }}>New to StudySync?  <Link href="/signup" underline="hover" sx={{ m: 1, color: 'lightBlue' }}>
                                        Sign up
                                    </Link></Typography>


                                    </Box>
                                </Menu>
                            </Box>
                        )}
                        {isLogin && (
                            <Box sx={{ flexGrow: 0 }}>

                            <Tooltip title="Open settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
                            <MenuItem onClick={handleProfile}>Profile</MenuItem>
                        </Menu>
                    </Box>
                        )}
                </Toolbar>
            </Container>
        </AppBar>
    );
}
export default ResponsiveAppBar;