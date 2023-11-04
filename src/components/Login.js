import{ Container, TextField , Button, Grid, Card, CardContent, Snackbar, IconButton} from "@mui/material";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from 'react-router-dom';
import Navbar2 from "./Navbar2";
import Close from "@mui/icons-material/Close";
import { useContext } from "react";
import { StoreContext } from "./StoreProvider";
import { types } from "./storeReducer";

export default function Login(){

        const [alert, setAlert] = useState('');
        const [nombre, setnombre] = useState('');
        const [correo, setCorreo] = useState('');
        const [contrasena, setcontrasena] = useState('');
        const [store, dispatch] = useContext (StoreContext)
      
        const [loading, setLoading] = useState(false);
        const navigate = useNavigate();
        const params = useParams();

        const [open, setOpen] = useState(false);

        const handleOpen= () => {setOpen(true);};
        const handleClose = () => {setOpen(false);};

        const handlecorreoChange = (e) => { setCorreo(e.target.value); };
      
        const handlecontrasenaChange = (e) => { setcontrasena(e.target.value); };
      
        const handleSubmit = async (e) => {
          e.preventDefault();
          try {
            const response = await fetch(process.env.REACT_APP_API_URL + '/registrousuario1/', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', },
              body: JSON.stringify({ correo, contrasena }),
            });
            if (response.ok) {
              // Autenticación exitosa, puedes redirigir al usuario o realizar otras acciones.
              setAlert('Inicio de sesión exitoso');
              handleOpen();
              const user = await response.json();

              await fetch (process.env.REACT_APP_API_URL + '/usuario2/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', },
                body: JSON.stringify({ user }),
              });
              dispatch({
                type: types.authLogin,
                payload: {id: user.id_usuario, nombre: user.nombre, email: user.email}
              });
              localStorage.setItem('snackbarVisible', 'true');
              navigate('/inicio');

            } else {
              // Autenticación fallida, puedes mostrar un mensaje de error.
              setAlert('Inicio de sesión fallido');
              handleOpen();
            }
          } catch (error) {
            console.error('Error al enviar la solicitud:', error);
          }
        };
      
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

    return (
      <>
       <Navbar2></Navbar2>
       <Container>
          <Grid container spacing={2} sx={{marginTop:'2rem'}}>
            <Grid item xs sx={{display:'flex', justifyContent:'center',alignItems:'center'}}>
              <img src='./images/CreditGuard.jpg'></img>
            </Grid>
            <Grid item xs>
              <Card sx={{ marginTop:'1.4rem'}}>
                <CardContent>
                  <h1 style={{textAlign:'center'}}>Iniciar Sesion</h1>
                  <form onSubmit={handleSubmit}>
                  <TextField style={{marginBottom:'2rem'}} fullWidth type="email" name="email" id="filled-basic" label="Correo" value={correo} variant="filled" onChange={handlecorreoChange} />
                  <TextField style={{marginBottom:'2rem'}} fullWidth type="password" name="password" id="filled-basic" label="Contraseña" value={contrasena} variant="filled" onChange={handlecontrasenaChange} />
                  <Link to="/inicio">
                  <Button style={{marginBottom:'2rem'}} fullWidth variant="contained" type="submit" onClick={handleSubmit}>Iniciar sesion</Button>
                  </Link>
                  <Snackbar
                      open={open}
                      autoHideDuration={6000}
                      onClose={handleClose}
                      message={alert}
                      action={action}
                    />
                  </form>
                  <Link to="/crearcuenta">
                  <Button style={{marginBottom:'2rem'}} fullWidth variant="contained" type="submit">Crear cuenta</Button>
                  </Link>
                  <div style={{ textAlign: 'center' }}>
                    <Link to="/correo">¿Olvidaste tu contraseña?</Link>
                  </div>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
       </Container>
      </>
    )
}