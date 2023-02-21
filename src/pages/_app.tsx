import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { ThemeOptions } from '@mui/material/styles';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';



export const themeOptions: ThemeOptions = {
    palette: {
        mode: 'dark',
        primary: {
            main: '#222831',
        },
        secondary: {
            main: '#00ADB5',
            dark: '#00ADB5',
            contrastText: '#EEEEEE',
        },
        text: {
            primary: '#EEEEEE',
        },
    },
    typography: {
        fontFamily: ' "Helvetica", "Arial", sans-serif',
    },
};

export default function App({ Component, pageProps }: AppProps) {
    const theme = createTheme(themeOptions);
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Component {...pageProps} />
        </ThemeProvider>
    )
}