import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useLayoutEffect, useRef } from 'react';
import { useNavigationLayout } from './NavigationSidebar.tsx';

export default function Navigation() {
    const {
        isCollapsed,
        setIsCollapsed,
        navBarWidth,
        setAppBarHeight,
    } = useNavigationLayout();
    const appBarRef = useRef<HTMLElement | null>(null);

    useLayoutEffect(() => {
        const appBar = appBarRef.current;
        if (!appBar) return;

        const updateHeight = () => setAppBarHeight(appBar.clientHeight);
        const observer = new ResizeObserver(updateHeight);
        observer.observe(appBar);
        updateHeight();
        return () => observer.disconnect();
    }, [setAppBarHeight]);

    return (
        <AppBar
            ref={appBarRef}
            position="fixed"
            sx={{
                marginLeft: isCollapsed ? 0 : navBarWidth,
                width: isCollapsed ? '100%' : `calc(100% - ${navBarWidth}px)`,
                zIndex: (muiTheme) => muiTheme.zIndex.drawer,
            }}
        >
            <Toolbar>
                {isCollapsed && (
                    <IconButton
                        color="inherit"
                        aria-label="open navigation"
                        edge="start"
                        onClick={() => setIsCollapsed(false)}
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                )}
                <Typography variant="h5" component="h1" sx={{ flexGrow: 1 }}>
                    Manga Nee
                </Typography>
            </Toolbar>
        </AppBar>
    );
}
