import { createTheme, responsiveFontSizes } from '@mui/material/styles';

export const theme = responsiveFontSizes(
    createTheme({
        cssVariables: {
            colorSchemeSelector: 'class',
        },
        colorSchemes: {
            light: {
                palette: {
                    primary: { main: '#5b74ef' },
                    secondary: { main: '#efd65b' },
                },
            },
            dark: {
                palette: {
                    primary: { main: '#5b74ef' },
                    secondary: { main: '#efd65b' },
                },
            },
        },
    }),
);
