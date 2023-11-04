import{ Container, TextField , Button, Grid, Card, CardContent, Snackbar, IconButton} from "@mui/material";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar2 from "./Navbar2";
import Close from "@mui/icons-material/Close";

export default function Correo(){

        const [alert, setAlert] = useState('');
        const [correo, setCorreo] = useState('');
        const [contrasena, setContrasena] = useState('');
        const [repcontrasena, setRepContrasena] = useState('');
        const [correoVisible, setCorreoVisible] = useState(true);
      
        const [loading, setLoading] = useState(false);
        const navigate = useNavigate();
        const params = useParams();

        const [open, setOpen] = useState(false);

        const handleOpen= () => {
          setOpen(true);
        };

        const handleClose = () => {
          setOpen(false);
        };

        const handlenombreChange = (e) => { setCorreo(e.target.value); };

        const handlecontraChange = (e) => { setContrasena(e.target.value); };
        const handlerepcontraChange = (e) => { setRepContrasena(e.target.value); };

        const validarCorreo = async () => {
          try {
              const response = await fetch(process.env.REACT_APP_API_URL + '/correo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', },
                body: JSON.stringify({correo}),
              });
              console.log(response);
        
              if (response.ok) {
                // Autenticación exitosa, puedes redirigir al usuario o realizar otras acciones.
                setCorreoVisible(false);
                setAlert('Correo existente. Puedes cambiar la contraseña');
                handleOpen();
              } else {
                // Autenticación fallida, puedes mostrar un mensaje de error.
                setAlert('El correo no esta registrado');
                handleOpen();
              }

          } catch (error) {
            console.error('Error al enviar la solicitud:', error);
          }
        };

        const handleSubmit = async (e) => {
          e.preventDefault();
          try {
              if(contrasena === repcontrasena)
              {
                const response = await fetch(process.env.REACT_APP_API_URL +'/usuario', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', },
                body: JSON.stringify({correo, contrasena}),
                });
        
                if (response.ok) {
                  // Autenticación exitosa, puedes redirigir al usuario o realizar otras acciones.
                  setAlert('Datos cambiados');
                  handleOpen();
                  navigate('/login');

                } else {
                  // Autenticación fallida, puedes mostrar un mensaje de error.
                  setAlert('Error de actualizacion.');
                  handleOpen();
                }
              }
              else{
                setAlert('Las contraseñas no son iguales, intente de nuevo.');
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
                  {correoVisible ? (
                      <CardContent>
                        <h1 style={{textAlign:'center'}}>Correo electrónico</h1>
                          <TextField style={{marginBottom:'2rem'}} fullWidth='true' type="text" name="Correo" id="filled-basic" label="Correo" value={correo} variant="filled" onChange={handlenombreChange} />
                          <Button style={{marginBottom:'2rem'}} fullWidth='true' variant="contained" type="submit" onClick={validarCorreo}>Validar correo</Button>
                      </CardContent>
                    ) : (
                      <CardContent>
                        <h1 style={{textAlign:'center'}}>Contraseña</h1>
                        <form onSubmit={handleSubmit}>
                          <TextField style={{marginBottom:'2rem'}} fullWidth='true' type="password" name="Contrasena" id="filled-basic" label="Contraseña" value={contrasena} variant="filled" onChange={handlecontraChange} />
                          <TextField style={{marginBottom:'2rem'}} fullWidth='true' type="password" name="RepContrasena" id="filled-basic" label="Repetir contraseña" value={repcontrasena} variant="filled" onChange={handlerepcontraChange} />
                          <Button style={{marginBottom:'2rem'}} fullWidth='true' variant="contained" type="submit" onClick={handleSubmit}>Actualizar contraseña</Button>                          
                        </form>
                      </CardContent>
                    )
                  }
                  <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} message={alert} action={action} />
              </Card>
            </Grid>
          </Grid>
       </Container>
      </>
    )
}