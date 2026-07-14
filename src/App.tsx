import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import { ThemeProvider } from '@mui/material/styles';
import Navigation from './Navigation.tsx';
import { theme } from './theme.ts';

export default function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Navigation />
            <Box component="main" sx={{ p: 3 }}>
                <Typography variant="h4">Manga Nee</Typography>
            </Box>
        </ThemeProvider>
    );
}
