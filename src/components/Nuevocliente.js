import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import{ Container, TextField,Button, Grid, Typography, Snackbar, IconButton, ToggleButtonGroup, ToggleButton} from "@mui/material";
import Autocomplete from '@mui/material/Autocomplete';
import Navbar from './Navbar';
import Close from '@mui/icons-material/Close';
import { useContext } from "react";
import { StoreContext } from "./StoreProvider";

export default function NuevoCliente() {
   // Define las variables de estado para los datos
   const [dataLoaded, setDataLoaded] = useState(false);
   const [alert, setAlert] = useState('');
   const [dataDistrito, setDataDistrito] = useState([]);
   const [dataUsuario, setDataUsuario] = useState([]);
   const [dataEstadoCivil, setDataEstadoCivil] = useState([]);
   const [dataNivelEducativo, setDataNivelEducativo] = useState([]);
   const [dataRegion, setDataRegion] = useState([]);
   const [dataMotivo, setDataMotivo] = useState([]);
   const [dataClientes, setClientes] = useState([]);
   const [store, dispatch] = useContext (StoreContext)
	 const { user } = store;

   const [task, setTask] = useState({
    nombre_cliente: "",
    dni: "",
    fecha_nacimiento: "",
    cantidad_propiedades: "",
    cantidad_hijos: "",
    genero: true,
    id_distrito: null,
    id_usuario: null,
    id_estadocivil: null,
    id_niveleducativo: null,
    salario: null,
    deudas: null,
    id_motivo: null,
  });

   const [editing, setEditing] = useState(false);
   const [loading, setLoading] = useState(false);
 
   const location = useLocation();
   const navigate = useNavigate();
   const params = useParams();

   const [open, setOpen] = useState(false);

        const handleOpen= () => {setOpen(true);};
        const handleClose = () => {setOpen(false);};
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

        const [alignment, setAlignment] = useState('');

        const handleChange2 = (event, newAlignment) => {
          setAlignment(newAlignment);
          if(newAlignment ==='true'){
            task.genero = true;
          }
          else {
            task.genero = false;
          }
        };

   const loadData = async () => {
    try {
      // Carga los datos de distrito
      const regionPromise = await fetch(process.env.REACT_APP_API_URL + '/region') // Reemplaza con la ruta correcta
      .then((response) => response.json())
      .then((data) => setDataRegion(data))
      .catch((error) => console.error('Error al cargar datos de región:', error));

      const distritoPromise = fetch(process.env.REACT_APP_API_URL + '/distrito') // Reemplaza con la ruta correcta
        .then((response) => response.json())
        .then((data) => setDataDistrito(data))
        .catch((error) => console.error('Error al cargar datos de distrito:', error));

      // Carga los datos de usuario
      const usuarioPromise = fetch(process.env.REACT_APP_API_URL + '/usuario') // Reemplaza con la ruta correcta
        .then((response) => response.json())
        .then((data) => setDataUsuario(data))
        .catch((error) => console.error('Error al cargar datos de usuario:', error));
      
      // Carga los datos de estado civil
      const estadoPromise = fetch(process.env.REACT_APP_API_URL + '/estado') // Reemplaza con la ruta correcta
        .then((response) => response.json())
        .then((data) => setDataEstadoCivil(data))
        .catch((error) => console.error('Error al cargar datos de estado civil:', error));

      // Carga los datos de nivel educativo
      const nivelPromise = fetch(process.env.REACT_APP_API_URL + '/educativo') // Reemplaza con la ruta correcta
        .then((response) => response.json())
        .then((data) => setDataNivelEducativo(data))
        .catch((error) => console.error('Error al cargar datos de nivel educativo:', error));

      // Carga los datos de motivo
      const motivoPromise = fetch(process.env.REACT_APP_API_URL + '/motivo') // Reemplaza con la ruta correcta
        .then((response) => response.json())
        .then((data) => setDataMotivo(data))
        .catch((error) => console.error('Error al cargar datos de motivo:', error));

      // Carga los datos de los clientes
      const clientePromise = fetch(process.env.REACT_APP_API_URL + '/clientes') // Reemplaza con la ruta correcta
       .then((response) => response.json())
       .then((data) => setClientes(data))
       .catch((error) => console.error('Error al cargar datos de los clientes:', error));
      
      await Promise.all([regionPromise,distritoPromise,usuarioPromise, estadoPromise, nivelPromise, motivoPromise, clientePromise]);

      if(dataRegion && dataDistrito && dataUsuario && dataEstadoCivil && dataNivelEducativo && dataMotivo && dataClientes) {
        setDataLoaded(true);
        } 
    } catch (error) { 
      console.error('Error al cargar datos:', error);
    }
  }

  const loadTask = async (id) => {
    try {
      if (!dataDistrito || !dataUsuario || !dataEstadoCivil || !dataNivelEducativo || !dataRegion || !dataMotivo) {
        await new Promise((resolve) => setTimeout(resolve, 100)); // Espera 100ms y vuelve a verificar
      }
      
      const res = await fetch(process.env.REACT_APP_API_URL + "/cliente/" + id);
      const data = await res.json();      

      // Crear un objeto de fecha a partir de la cadena
      const fecha = new Date(data.fecha_nacimiento);

      // Obtener el año, mes y día
      const anio = fecha.getFullYear(); // 2023
      let mes = null;
      let dia = null;
      if(fecha.getMonth()+1 < 10){
        mes = "0" + (fecha.getMonth() + 1);
      } else{
        mes = fecha.getMonth() + 1;
      }
      if(fecha.getDate() < 10){
        dia = "0" + fecha.getDate();
      } else{
        dia = fecha.getDate();
      }
      const distrito = dataDistrito.find((item) => item.id_distrito === data.id_distrito);
      const motivo = dataMotivo.find((item) => item.id_motivo_prestamo === data.id_motivo);
      const usuario = dataUsuario.find((item) => item.id_usuario === data.id_usuario);
      const estadocivil = dataEstadoCivil.find((item) => item.id_estado_civil === data.id_estadocivil);
      const niveleducativo = dataNivelEducativo.find((item) =>item.id_nivel_educativo === data.id_niveleducativo);
      setTask({
        nombre_cliente: data.nombre_cliente,
        dni: data.dni,
        fecha_nacimiento: anio + "-" + mes + "-" + dia,
        cantidad_propiedades: data.cantidad_propiedades,
        cantidad_hijos: data.cantidad_hijos,
        genero: data.genero,
        id_distrito: distrito || "",
        id_usuario: usuario || "",
        id_estadocivil: estadocivil || "",
        id_niveleducativo: niveleducativo || "",
        salario: data.salario,
        deudas: data.deudas,
        id_motivo: motivo || "",
      });
      setAlignment(String(data.genero));
      setEditing(true);
    } catch (error) {
      console.error("Error al cargar el cliente:", error);
    }
  };

    // Usa useEffect para cargar los datos cuando el componente se monta
    useEffect(() => {
      if(location.pathname==='/agregarcliente'){
        loadData();
      }else{
        if (params.id) {
          loadData();
          if (dataLoaded) {
            loadTask(params.id);
          }
        }
      }
      
    }, [params.id, dataLoaded]);

    function calcularEdad(fechaNacimiento) {
      const fechaNacimientoArray = fechaNacimiento.split('-');
      const anioNacimiento = parseInt(fechaNacimientoArray[0], 10);
      const mesNacimiento = parseInt(fechaNacimientoArray[1], 10);
      const diaNacimiento = parseInt(fechaNacimientoArray[2], 10);
    
      const fechaActual = new Date();
      const diaActual = fechaActual.getDate();
      const mesActual = fechaActual.getMonth() + 1;
      const anioActual = fechaActual.getFullYear();
    
      let edad = anioActual - anioNacimiento;
    
      // Ajustar la edad si aún no se ha alcanzado el cumpleaños de este año
      if (mesActual < mesNacimiento || (mesActual === mesNacimiento && diaActual < diaNacimiento)) {
        edad--;
      }
    
      return edad;
    }

  const handleChange = (e) => {
    const fieldName = e.target.name;
    const newValue = e.target.value;
    setTask((prevTask) => ({
      ...prevTask,
      [fieldName]: newValue,
    }));
  };

  const handlenumChange = (e) => {
    const fieldName = e.target.name;
    const newValue = e.target.value;
    if (/^[0-9]*$/.test(newValue)) {
      setTask((prevTask) => ({
        ...prevTask,
        [fieldName]: newValue,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const dniDuplicado = dataClientes.some((e) => e.dni ===task.dni);
    const edad = calcularEdad(task.fecha_nacimiento);
    if(task.dni.length !== 8){
      setAlert("El DNI no es de 8 dígitos. Intente de nuevo"); handleOpen();
    }
    else if(edad<18){
      setAlert("El cliente es menor de edad. Intente de nuevo."); handleOpen();
    }
    else{    
      try {
        if(editing){
          const response = await fetch(`http://localhost:4000/cliente/${params.id}`, {
              method:'PUT',
              headers:{'Content-Type': 'application/json'},
              body: JSON.stringify(task)
            })
          if (response.ok) {
            // Éxito: redirecciona o realiza cualquier acción deseada
            navigate('/registro');
          } else {
            // Manejar errores aquí si es necesario
            console.error("Error al crear el cliente");
          }
        }else{          
          const updatedTask = { ...task};
          updatedTask.id_usuario = dataUsuario.find((item) => item.id_usuario === user.id);
         console.log(dataUsuario, user)
         
          if(dniDuplicado){
            setAlert("El DNI ya se ha registrado. Intente de nuevo"); handleOpen();
          }
          else{
            const response = await fetch(process.env.REACT_APP_API_URL + "/cliente", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(updatedTask),
            });
            console.log(response);
            if (response.ok) {
              // Éxito: redirecciona o realiza cualquier acción deseada
              navigate('/registro');
            } else {
              // Manejar errores aquí si es necesario
              console.error("Error al crear el cliente");
            }
          }           
        }       
      }
      catch (error) {
        console.error("Error en la solicitud:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Resto de tu código, incluyendo las Autocompletaciones

  return (dataLoaded && (
    <>
      <Navbar/>
      <Container sx={{ marginTop:'2rem'}}>
          <Typography variant='h3' textAlign='center' sx={{margin:"2rem 0"}}>
              {editing ? "Modificar cliente" : "Crear nuevo cliente"}
          </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField onChange={handleChange} fullWidth name="nombre_cliente" id="filled-basic" label="Nombre" variant="filled" value={task.nombre_cliente} sx={{ marginBottom:'2rem'}}/>
                <TextField label="Fecha de nacimiento" type="date" name="fecha_nacimiento" value={task.fecha_nacimiento} onChange={handleChange} InputLabelProps={{ shrink: true }} sx={{ marginBottom:'2rem'}}/>
                <ToggleButtonGroup sx={{marginLeft:".9rem"}}
                  color="primary"
                  value={alignment}
                  exclusive
                  onChange={handleChange2}
                  aria-label="Platform"
                >
                  <ToggleButton value="true">Hombre</ToggleButton>
                  <ToggleButton value="false">Mujer</ToggleButton>
                </ToggleButtonGroup>
                <TextField onChange={handlenumChange} fullWidth name="cantidad_propiedades" id="filled-basic1" label="Cantidad Propiedades" variant="filled" value={task.cantidad_propiedades} sx={{ marginBottom:'2rem'}}/>
                <TextField onChange={handlenumChange} fullWidth name="cantidad_hijos" id="filled-basic1" label="Cantidad Hijos" variant="filled" value={task.cantidad_hijos} sx={{ marginBottom:'2rem'}}/>
                <TextField onChange={handlenumChange} fullWidth name="salario" id="filled-basic1" label="Salario" variant="filled" value={task.salario} sx={{ marginBottom:'2rem'}}/>
                <TextField onChange={handlenumChange} fullWidth name="deudas" id="filled-basic1" label="Deudas" variant="filled" value={task.deudas} sx={{ marginBottom:'2rem'}}/>
              </Grid>
              <Grid item xs={6}>
                <TextField onChange={handlenumChange} fullWidth name="dni" id="filled-basic1" label="DNI" variant="filled" value={task.dni} sx={{ marginBottom:'2rem'}}/>
                <Autocomplete value={task.id_distrito}
                  onChange={(event, newValue) => { setTask({ ...task, id_distrito: newValue }); }}
                  options={dataDistrito || []}
                  getOptionLabel={(option) => option.nombre_distrito}
                  renderInput={(params) => ( <TextField {...params} label="Distrito" variant="outlined" fullWidth /> )}
                  getOptionSelected={(option, value) => option.nombre_distrito === value.nombre_distrito} sx={{ marginBottom:'2rem'}}
                  disabled={!dataLoaded} // Deshabilita el Autocomplete mientras los datos se cargan
                  />

                <Autocomplete value={task.id_estadocivil}
                  onChange={(event, newValue) => { setTask({ ...task, id_estadocivil: newValue }); }}
                  options={dataEstadoCivil || []} // Reemplaza dataEstadoCivil con tus opciones reales
                  getOptionLabel={(option) => option.tipo_de_estado} // Ajusta según tus datos reales
                  renderInput={(params) => ( <TextField {...params} label="Estado Civil" variant="outlined" fullWidth /> )}
                  getOptionSelected={(option, value) => option.tipo_de_estado === value.tipo_de_estado} sx={{ marginBottom:'2rem'}}
                  disabled={!dataLoaded} // Deshabilita el Autocomplete mientras los datos se cargan
                  />

                <Autocomplete value={task.id_niveleducativo}
                  onChange={(event, newValue) => { setTask({ ...task, id_niveleducativo: newValue }); }}
                  options={dataNivelEducativo || []} // Reemplaza dataNivelEducativo con tus opciones reales
                  getOptionLabel={(option) => option.nivel_educativo} // Ajusta según tus datos reales
                  renderInput={(params) => ( <TextField {...params} label="Nivel Educativo" variant="outlined" fullWidth /> )}
                  getOptionSelected={(option, value) => option.nivel_educativo === value.nivel_educativo} sx={{ marginBottom:'2rem'}}
                  disabled={!dataLoaded} // Deshabilita el Autocomplete mientras los datos se cargan
                  />

                <Autocomplete value={task.id_motivo}
                  onChange={(event, newValue) => { setTask({ ...task, id_motivo: newValue }); }}
                  options={dataMotivo || []} // Reemplaza dataMotivo con tus opciones reales
                  getOptionLabel={(option) => option.motivo} // Ajusta según tus datos reales
                  renderInput={(params) => ( <TextField {...params} label="Motivo" variant="outlined" fullWidth /> )}
                  getOptionSelected={(option, value) => option.motivo === value.motivo} sx={{ marginBottom:'2rem'}}
                  disabled={!dataLoaded} // Deshabilita el Autocomplete mientras los datos se cargan
                  />
                <Button variant="contained" type="submit" sx={{ marginBottom:'2rem'}} fullWidth> {editing ? "Modificar cliente" : "Agregar cliente"} </Button>
              </Grid>   
              <Snackbar
                      open={open}
                      autoHideDuration={6000}
                      onClose={handleClose}
                      message={alert}
                      action={action}
                    />
          </Grid>
        </form>
      </Container>
    </>
  ));
}