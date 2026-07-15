import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Navigation from './Navigation.tsx';
import NavigationSidebar, {
    NAVIGATION_PATHS,
    NavigationSidebarProvider,
    useNavigationLayout,
} from './NavigationSidebar.tsx';
import { theme } from './theme.ts';

function Page({ title }: { title: string }) {
    return <Typography variant="h4">{title}</Typography>;
}

function AppLayout() {
    const { navBarWidth, appBarHeight } = useNavigationLayout();

    return (
        <Box sx={{ display: 'flex' }}>
            <Navigation />
            <Box sx={{ flexShrink: 0, position: 'relative', height: '100vh' }}>
                <NavigationSidebar />
            </Box>
            <Box
                id="appMainContainer"
                component="main"
                sx={{
                    minHeight: `calc(100vh - ${appBarHeight}px)`,
                    width: `calc(100vw - (100vw - 100%) - ${navBarWidth}px)`,
                    minWidth: `calc(100vw - (100vw - 100%) - ${navBarWidth}px)`,
                    maxWidth: `calc(100vw - (100vw - 100%) - ${navBarWidth}px)`,
                    position: 'relative',
                    mt: `${appBarHeight}px`,
                    p: 3,
                }}
            >
                <Routes>
                    <Route path="/" element={<Navigate to={NAVIGATION_PATHS.library} replace />} />
                    <Route path={NAVIGATION_PATHS.library} element={<Page title="Library" />} />
                    <Route path={NAVIGATION_PATHS.history} element={<Page title="History" />} />
                    <Route path={`${NAVIGATION_PATHS.settings}/*`} element={<Page title="Settings" />} />
                    <Route path="*" element={<Navigate to={NAVIGATION_PATHS.library} replace />} />
                </Routes>
            </Box>
        </Box>
    );
}

export default function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <BrowserRouter>
                <NavigationSidebarProvider>
                    <AppLayout />
                </NavigationSidebarProvider>
            </BrowserRouter>
        </ThemeProvider>
    );
}
