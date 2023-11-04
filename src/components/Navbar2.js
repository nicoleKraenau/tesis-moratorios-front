import{ Typography, AppBar,Button,Toolbar} from "@mui/material";
import Login from './Login'
import { Link, useLocation } from 'react-router-dom'; 
export default function Navbar2(){
    
    const location = useLocation();

    const shouldShowButton = location.pathname === '/login' || location.pathname === '/';

    return (
        <AppBar position="static" sx={{ background: '#31C637' }}>
      <Toolbar bg="dark">
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Credit Guard
        </Typography>
        {!shouldShowButton && <Button variant='contained' sx={{ background: '#000000', marginLeft:'auto' }} component={Link} to="/login" element={<Login />}> Volver </Button>}
      </Toolbar>
    </AppBar>
    )
}