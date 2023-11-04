import{ Typography, AppBar,Button,Toolbar, Modal, Box, Grid} from "@mui/material";
import Login from './Login'
import Registro from './Registro'
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useContext } from "react";
import { StoreContext } from "./StoreProvider";
import { types } from "./storeReducer";

export default function Navbar(){
    
      const location = useLocation();

      const [open, setOpen] = useState(false);
      const [store, dispatch] = useContext (StoreContext);
      const navigate = useNavigate();

      const handleOpen = () => {setOpen(true);};
      const handleClose = () => {setOpen(false);};

      const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
      };

      const cerrarsesion = () => {
        dispatch({ type: types.authLogout})
        navigate("/login");
      }

    return (
      <AppBar position="static" sx={{ background: '#31C637' }}>
        <Toolbar bg="dark">
          <Typography variant="h6" component="div" > Credit Guard </Typography>
            <Button color={location.pathname==='/inicio'? "error": "inherit"} component={Link} to="/inicio" element={<Login />}> Inicio </Button>
            <Button color={location.pathname==='/registro' || location.pathname.startsWith('/agregarcliente')? "error": "inherit"} component={Link} to="/registro" element={<Registro />}> Registro </Button>
            <Button color={location.pathname==='/resultado'? "error": "inherit"} component={Link} to="/resultado" element={<Login />}> Resultado </Button>
            <Button color={location.pathname==='/dashboard'? "error": "inherit"} component={Link} to="/dashboard" element={<Login />}> Dashboard </Button>
            <Button variant='contained' sx={{ background: '#000000', marginLeft:'auto' }} onClick={handleOpen}> Cerrar sesión </Button>
              <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={style}>
                  <Typography variant="h6" component="div" style={{textAlign:'center'}}> ¿Desea cerrar sesión? </Typography>
                  <Grid container spacing={2} sx={{marginTop:'2rem'}}>
                    <Grid item xs={6}>
                      <Button fullWidth variant='contained' color='success' onClick={() => cerrarsesion()}> Sí </Button>
                    </Grid>
                    <Grid item xs={6}>
                      <Button fullWidth variant='contained' color='error' onClick={handleClose}> No </Button>
                    </Grid>
                  </Grid>
                </Box>
              </Modal>
        </Toolbar>
    </AppBar>
    )
}