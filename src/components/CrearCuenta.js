import{ Container, TextField,Button, Grid, CardContent, Card, Snackbar, IconButton, Alert, SnackbarContent} from "@mui/material";
import React, { useEffect, useState } from "react";
import Close from '@mui/icons-material/Close';
import { useNavigate, useParams } from "react-router-dom";
import Navbar2 from "./Navbar2";

const CrearCuenta = () =>{

        const [alert, setAlert] = useState('');
        const [task, setTask] = useState({
          nombre: "",
          email: "",
          contrasena: "",
        });
        const [loading, setLoading] = useState(false);

        const [usuarios,setUsuarios] = useState();

        const navigate = useNavigate();
        const params = useParams();
      
        useEffect(() => {
          fetch(process.env.REACT_APP_API_URL + '/usuario') // Reemplaza con la ruta correcta
          .then((response) => response.json())
          .then((data) => setUsuarios(data))
          .catch((error) => console.error('Error al cargar datos de usuario:', error));

          if (params.id) {
            loadTask(params.id);
          }
        }, [params.id]);
      
        const [open, setOpen] = useState(false);

        const handleOpen= () => {
          setOpen(true);
        };

        const handleClose = () => {
          setOpen(false);
        };


        const loadTask = async (id) => {
          const res = await fetch(process.env.REACT_APP_API_URL + "/registrousuario/" + id);
          const data = await res.json();
          setTask({ title: data.title, description: data.description });
        };

        function findEmail(){
          let found = false;
          usuarios.forEach(e => {
              if(e.email = task.email) found = true;
          });
          return found;
        }
        
        const handleChange = (e) => setTask({ ...task, [e.target.name]: e.target.value });
    
        const handleSubmit = async (e) => {
            e.preventDefault();
            setLoading(true);
            if(task.contrasena !== "" && task.email !=="" && task.nombre !== "")
            {
              if(!findEmail()){
                const response = await fetch(process.env.REACT_APP_API_URL + "/registrousuario", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(task),
                });
                const data =await response.json();
              }
              else{
                setAlert("El correo ya ha sido registrado. Intente con otro.");
                setOpen(true);
              }              
            }
            else{
              setAlert("Complete todos los campos.");
              setOpen(true);
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
              <img src='./images/CreditGuard.jpg' alt="Logo de CreditGuard"></img>
            </Grid>
            <Grid item xs>
              <Card sx={{ marginTop:'1.4rem'}}>
                <CardContent>
                  <h1 style={{textAlign:'center'}}>Crear Cuenta</h1>
                  <form onSubmit={handleSubmit}>
                    <TextField onChange={handleChange} style={{marginBottom:'2rem'}} fullWidth name="nombre" id="filled-basic" label="Nombre" variant="filled" value={task.nombre}/>
                    <TextField onChange={handleChange} style={{marginBottom:'2rem'}} fullWidth name="email" id="filled-basic1" label="Email" variant="filled" type="email" value={task.email}/>
                    <TextField onChange={handleChange} style={{marginBottom:'2rem'}} fullWidth name="contrasena"  id="filled-basic2" label="Contraseña" variant="filled" type="password" value={task.contrasena}/>
                    <Button fullWidth variant="contained" type="submit">Crear Cuenta</Button>
                    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                      <SnackbarContent message={alert} action={action} sx={{backgroundColor:'red'}}></SnackbarContent>
                    </Snackbar>
                  </form>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
       </>
    );
    
};
export default CrearCuenta