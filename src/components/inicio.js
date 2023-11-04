import {Container, Grid, IconButton, Snackbar} from '@mui/material'
import Navbar from './Navbar'
import { Outlet, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import Close from '@mui/icons-material/Close';

export default function Inicio(){
    const [alert] = useState('Inicio de sesion exitoso.');

    const snackbarVisible = localStorage.getItem("snackbarVisible");
    const isSnackbarVisible = snackbarVisible === "true" ? true : false;
    const [open, setOpen] = useState(isSnackbarVisible);

        const handleClose = () => {setOpen(false); localStorage.removeItem("snackbarVisible");};

        const action = (
            <React.Fragment>
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleClose}
              >
                <Close fontSize="small" />
              </IconButton>
            </React.Fragment>
          );

          window.addEventListener("beforeunload", function () {
            localStorage.removeItem("snackbarVisible");
          });

    return (
        <>
        <Navbar></Navbar>
        <Container>
            <Grid container spacing={2} sx={{marginTop:'2rem'}}>
                <Grid item xs sx={{textAlign:'justify'}}>
                    <h1 style={{textAlign:'center'}}>Bienvenido a CreditGuard!</h1>
                    <p>El sistema de predicción de la morosidad consiste en la aplicación de dos algoritmos de árboles de clasificados basados en Machine Learning para que, usando los datos personales y de créditos de consumo de los clientes, se pueda comprobar la probabilidad de que los clientes sean potencialmente morosos.</p>
                    <p>Con nuestro sistema, podrás gestionar los datos de tus clientes, calcular la probabilidad de incumplimiento de pagos de tus clientes, y obtendrás recomendaciones sobre si aceptar o rechazar una futura solicitud del cliente moroso.</p>  
                </Grid>
                <Grid item xs sx={{display:'flex', justifyContent:'center',alignItems:'center'}}>
                    <img src='./images/Menu.jpg' style={{height:'348px', width:'570px'}}></img>
                </Grid>
                <Snackbar
                      open={open}
                      autoHideDuration={5000}
                      onClose={handleClose}
                      message={alert}
                      action={action}
                />
            </Grid>
        </Container>
        </>
        
    )
}