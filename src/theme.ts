import { createTheme, responsiveFontSizes } from '@mui/material/styles';

export const theme = responsiveFontSizes(createTheme({
    palette: {
        mode: 'dark',
        primary: { main: '#5b74ef' },
        secondary: { main: '#efd65b' },
        background: {
            default: '#0f0f1a',
            paper: '#171722',
        },
    },
}));
