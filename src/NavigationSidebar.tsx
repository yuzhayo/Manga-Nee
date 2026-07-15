import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import HistoryIcon from '@mui/icons-material/History';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import SettingsIcon from '@mui/icons-material/Settings';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { styled } from '@mui/material/styles';
import {
    createContext,
    useContext,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
    type Dispatch,
    type ReactNode,
    type SetStateAction,
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const NAVIGATION_PATHS = {
    library: '/library',
    history: '/history',
    settings: '/settings',
} as const;

const NAVIGATION_ITEMS = [
    { path: NAVIGATION_PATHS.library, label: 'Library', icon: LibraryBooksIcon },
    { path: NAVIGATION_PATHS.history, label: 'History', icon: HistoryIcon },
    { path: NAVIGATION_PATHS.settings, label: 'Settings', icon: SettingsIcon },
] as const;

type NavigationLayoutContextValue = {
    isCollapsed: boolean;
    setIsCollapsed: Dispatch<SetStateAction<boolean>>;
    navBarWidth: number;
    setNavBarWidth: Dispatch<SetStateAction<number>>;
    appBarHeight: number;
    setAppBarHeight: Dispatch<SetStateAction<number>>;
};

const NavigationLayoutContext = createContext<NavigationLayoutContextValue | null>(null);

export function useNavigationLayout(): NavigationLayoutContextValue {
    const context = useContext(NavigationLayoutContext);
    if (!context) throw new Error('useNavigationLayout must be used inside NavigationSidebarProvider');
    return context;
}

export function NavigationSidebarProvider({ children }: { children: ReactNode }) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [navBarWidth, setNavBarWidth] = useState(0);
    const [appBarHeight, setAppBarHeight] = useState(64);

    const value = useMemo(
        () => ({
            isCollapsed,
            setIsCollapsed,
            navBarWidth,
            setNavBarWidth,
            appBarHeight,
            setAppBarHeight,
        }),
        [isCollapsed, navBarWidth, appBarHeight],
    );

    return (
        <NavigationLayoutContext.Provider value={value}>
            {children}
        </NavigationLayoutContext.Provider>
    );
}

const SidebarHeaderRoot = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
}));

function NavigationSidebarHeader({ onCollapse }: { onCollapse: () => void }) {
    return (
        <>
            <SidebarHeaderRoot>
                <IconButton aria-label="collapse navigation" onClick={onCollapse}>
                    <ChevronLeftIcon />
                </IconButton>
            </SidebarHeaderRoot>
            <Divider />
        </>
    );
}

type NavigationItem = (typeof NAVIGATION_ITEMS)[number];

function NavigationSidebarItem({ item, collapsed }: { item: NavigationItem; collapsed: boolean }) {
    const navigate = useNavigate();
    const location = useLocation();
    const Icon = item.icon;
    const active = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);

    return (
        <ListItem disablePadding>
            <ListItemButton
                selected={active}
                onClick={() => navigate(item.path)}
                sx={{
                    flexDirection: collapsed ? 'column' : 'row',
                    py: collapsed ? 1 : 'auto',
                }}
            >
                <ListItemIcon
                    sx={{
                        justifyContent: 'center',
                        minWidth: collapsed ? 'auto' : 56,
                    }}
                >
                    <Icon />
                </ListItemIcon>
                {!collapsed && <ListItemText primary={item.label} />}
            </ListItemButton>
        </ListItem>
    );
}

export default function NavigationSidebar() {
    const { isCollapsed, setIsCollapsed, navBarWidth, setNavBarWidth } = useNavigationLayout();
    const paperRef = useRef<HTMLDivElement | null>(null);

    useLayoutEffect(() => {
        const paper = paperRef.current;
        if (!paper) return;

        const updateWidth = () => setNavBarWidth(paper.clientWidth);
        const observer = new ResizeObserver(updateWidth);
        observer.observe(paper);
        updateWidth();
        return () => observer.disconnect();
    }, [setNavBarWidth]);

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: navBarWidth,
                '& .MuiDrawer-paper': {
                    zIndex: (theme) => theme.zIndex.drawer - 1,
                },
            }}
            slotProps={{ paper: { ref: paperRef } }}
        >
            <Box
                sx={{
                    minWidth: isCollapsed ? undefined : 240,
                    maxWidth: isCollapsed ? 120 : 400,
                }}
            >
                <NavigationSidebarHeader onCollapse={() => setIsCollapsed(true)} />
                <List sx={{ p: 1 }} dense={isCollapsed}>
                    {NAVIGATION_ITEMS.map((item) => (
                        <NavigationSidebarItem key={item.path} item={item} collapsed={isCollapsed} />
                    ))}
                </List>
            </Box>
        </Drawer>
    );
}
