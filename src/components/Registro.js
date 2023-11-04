import Navbar from './Navbar'
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import{Typography, Snackbar, SnackbarContent,Button,TextField, Modal, Box, Grid,Table,TableBody,TableContainer,TableHead,TableRow,Paper,Container, Input, IconButton, Stack} from "@mui/material";
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import Papa from 'papaparse';
import Close from '@mui/icons-material/Close';

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));
  
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));
  
export default function Registro(){

    // Define las variables de estado para los datos
    const [alert,setAlert] = useState("");
    const [dataLoaded, setDataLoaded] = useState(false);
    const [dataDistrito, setDataDistrito] = useState([]);
    const [dataUsuario, setDataUsuario] = useState([]);
    const [dataEstadoCivil, setDataEstadoCivil] = useState([]);
    const [dataNivelEducativo, setDataNivelEducativo] = useState([]);
    const [dataRegion, setDataRegion] = useState([]);
    const [dataMotivo, setDataMotivo] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [clientesExport, setClientesExport] = useState([]);
    const [pbi,setPBI] = useState('');
    
    const navigate = useNavigate();

    const [openDeleteAll, setOpenDeleteAll] = useState(false);

      const handleOpenDeleteAll = () => {
        setOpenDeleteAll(true);
      };

      const handleCloseDeleteAll = () => {
        setOpenDeleteAll(false);
      };

      const [openDelete, setOpenDelete] = useState([]);

      const handleOpenDelete = (clientIndex) => {
        const newOpenDelete = [...openDelete];
        newOpenDelete[clientIndex] = true;
        setOpenDelete(newOpenDelete);
      };

      const handleCloseDelete = (clientIndex) => {
        const newOpenDelete = [...openDelete];
        newOpenDelete[clientIndex] = false;
        setOpenDelete(newOpenDelete);
      };

      const [open, setOpen] = useState(false);

        const handleOpen= (clientIndex) => {
          setOpen(true);
        };

        const handleClose = (clientIndex) => {
          setOpen(false);
        };

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

      const loadData = async () => {
        try {
          // Carga los datos de distrito
          fetch(process.env.REACT_APP_API_URL + '/region') // Reemplaza con la ruta correcta
          .then((response) => response.json())
          .then((data) => setDataRegion(data))
          .catch((error) => console.error('Error al cargar datos de región:', error));

          fetch(process.env.REACT_APP_API_URL + '/distrito') // Reemplaza con la ruta correcta
            .then((response) => response.json())
            .then((data) => setDataDistrito(data))
            .catch((error) => console.error('Error al cargar datos de distrito:', error));

          // Carga los datos de usuario
          fetch(process.env.REACT_APP_API_URL + '/usuario') // Reemplaza con la ruta correcta
            .then((response) => response.json())
            .then((data) => setDataUsuario(data))
            .catch((error) => console.error('Error al cargar datos de usuario:', error));
          
          // Carga los datos de estado civil
          fetch(process.env.REACT_APP_API_URL + '/estado') // Reemplaza con la ruta correcta
            .then((response) => response.json())
            .then((data) => setDataEstadoCivil(data))
            .catch((error) => console.error('Error al cargar datos de estado civil:', error));

          // Carga los datos de nivel educativo
          fetch(process.env.REACT_APP_API_URL + '/educativo') // Reemplaza con la ruta correcta
            .then((response) => response.json())
            .then((data) => setDataNivelEducativo(data))
            .catch((error) => console.error('Error al cargar datos de nivel educativo:', error));

          // Carga los datos de motivo
          fetch(process.env.REACT_APP_API_URL + '/motivo') // Reemplaza con la ruta correcta
            .then((response) => response.json())
            .then((data) => setDataMotivo(data))
            .catch((error) => console.error('Error al cargar datos de motivo:', error));

          // Carga los datos de los clientes
          // fetch(process.env.REACT_APP_API_URL + '/clientes') // Reemplaza con la ruta correcta
          // .then((response) => response.json())
          // .then((data) => setClientes(data))
          // .catch((error) => console.error('Error al cargar datos de los clientes:', error));
          
          if(dataRegion && dataDistrito && dataUsuario && dataEstadoCivil && dataNivelEducativo && dataMotivo) {
          setDataLoaded(true);
          loadClientes();
          } 
        } catch (error) {
          console.error('Error al cargar datos:', error);
        }
      }


    // Usa useEffect para cargar los datos cuando el componente se monta
    useEffect(() => {
        loadData();
    }, [dataLoaded]);


    // Supongamos que tienes una función que carga y procesa el archivo CSV
    async function processCSVFile(file) {
      try {
        // Lee el archivo CSV y conviértelo en un array de objetos
        const csvData = await readFile(file);
        // Pasar el csvData a dataImport para cambiar los tipos de datos de los campos del cliente
        const changedData = await changeDataType(csvData);
        
        // Realiza la consulta a la base de datos PostgreSQL con los datos del CSV
        changedData.forEach(async (e)=>{
          await uploadCSVDataToServer(e);
        })

        console.log('Consulta a la base de datos completada.');
      } catch (error) {
        console.error('Error al procesar el archivo CSV o realizar la consulta a la base de datos:', error);
      }
    }

    // Función para leer el archivo CSV y convertirlo en un array de objetos
    function readFile(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          //const fileContent = event.target.result;
          const parsedData = CSVToArray(event.target.result); // Supongamos que tienes una función para esto
          
          resolve(parsedData);
        };
        reader.onerror = (error) => {
          reject(error);
        };
        reader.readAsText(file);
      });
    }

    function changeDataType(csvData){
      const clients = []

      csvData.forEach(e => {
        const fechaoriginal = e.fecha_nacimiento;
        const partes = fechaoriginal.split('/');
        const dia = partes[0];
        const mes = partes[1];
        const anio = partes[2];
        
        const client = {
          nombre_cliente: e.nombre_cliente,
          dni: e.dni,
          fecha_nacimiento: `${anio}-${mes}-${dia}`,
          cantidad_propiedades: e.cantidad_propiedades,
          cantidad_hijos: e.cantidad_hijos,
          genero: JSON.parse(e.genero),
          id_distrito: dataDistrito[e.id_distrito-1],
          id_usuario: dataUsuario[e.id_usuario-1],
          id_estadocivil: dataEstadoCivil[e.id_estadocivil-1],
          id_niveleducativo: dataNivelEducativo[e.id_niveleducativo-1],
          salario: e.salario,
          deudas: e.deudas,
          id_motivo: dataMotivo[e.id_motivo-1]
        }

        clients.push(client); 
      });
      return clients;
    }

    // Función para realizar la consulta a la base de datos PostgreSQL a través de una solicitud fetch
    async function uploadCSVDataToServer(csvData) {
      try {
        const dniDuplicado = clientes.some((e) => e.dni ===csvData.dni);
        if(dniDuplicado){
          alert("El DNI ya se ha registrado. Intente de nuevo");
        }
        else{
          const response = await fetch(process.env.REACT_APP_API_URL + "/cliente", {
            method: 'POST',
            headers: {'Content-Type': 'application/json',},
            body: JSON.stringify(csvData), // Envía los datos como JSON al backend
          });
          if (response.ok) {
            const responseData = await response.json();
          } else {
            console.error('Error al cargar el archivo CSV en el servidor');
          }
        }
      } catch (error) {
        console.error('Error en la solicitud fetch al servidor:', error);
      }
    }

    // Función para convertir el contenido del CSV en un array de objetos
    function CSVToArray(csvString) {
      return Papa.parse(csvString, {header:true, complete: () => {}}).data
    }

    // Llama a esta función después de seleccionar un archivo CSV en tu interfaz de usuario
    const handleFileChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        processCSVFile(file);
        window.location.reload();
      }
    };

    const exportClients = async () => {
      let clientstoExport = [];
          clientes.forEach(element => {
            const fecha = new Date(element.fecha_nacimiento);
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
            console.log(element.genero);
            const client = ({
              id_cliente: element.id_cliente,
              nombre_cliente: element.nombre_cliente,
              dni: element.dni,
              fecha_nacimiento: anio + "-" + mes + "-" + dia,
              cantidad_propiedades: element.cantidad_propiedades,
              cantidad_hijos: element.cantidad_hijos,
              genero: element.genero ? 'Hombre' : "Mujer",
              distrito: dataDistrito[element.id_distrito-1].nombre_distrito,
              usuario: dataUsuario.find((e) => e.id_usuario === element.id_usuario).nombre,
              estadocivil: dataEstadoCivil[element.id_estadocivil-1].tipo_de_estado,
              niveleducativo: dataNivelEducativo[element.id_niveleducativo-1].nivel_educativo,
              salario: element.salario,
              deudas: element.deudas,
              motivo: dataMotivo[element.id_motivo-1].motivo,
            });
            clientstoExport.push(client);
          });
          console.log(clientstoExport);
          setClientesExport(clientstoExport);
      const csvData = Papa.unparse(clientstoExport);
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'data.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    }

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

    const handleDelete = async (id) => {      
      try {
        await fetch(`http://localhost:4000/cliente/${id}`, {
        method:'DELETE',
        })
        setClientes(clientes.filter(cliente => cliente.id_cliente!== id));
      } catch (error) {
        console.log(error);
      }
    }

    const handleDeleteAll = async () => {      
      try {
        await fetch(`http://localhost:4000/clientes/`, {
        method:'DELETE',
        })
        window.location.reload();
      } catch (error) {
        console.log(error);
      }
    }
    
    const loadClientes = async () => {
      const response =  await fetch(process.env.REACT_APP_API_URL + '/clientes')
      const data = await response.json();
      setClientes(data);
    }
    
    const handleCalculate = () =>{
      setAlert('Se completó el cálculo. Ingresa a Resultados para ver las probabilidades');
      handleOpen();
    }

    const handlePBIChange = (e) =>{
      const newValue = e.target.value;
      if (/^[0-9]*\.?[0-9]*$/.test(newValue)) {
        setPBI(newValue);
      }
    }

    return (dataLoaded &&(
        <>
          <Navbar/>
          <Container>
          <Box component='div' sx={{textAlign:'right', marginTop:'2rem'}}>
            <Typography variant="h6" display="inline" sx={{marginRight:'.4rem'}}>PBI</Typography>
            <TextField variant="outlined" size='small' value={pbi} onChange={handlePBIChange} />
          </Box>
            <Grid container spacing={2} sx={{marginTop:'.5rem', marginBottom:'2rem'}}>
              <Grid item xs={3}>
              <div>
                <Stack spacing={4} orientation="vertical" fullWidth aria-label="vertical contained button group">
                    <Button variant="contained" key="uno" sx={{marginBottom:'2rem'}} onClick={exportClients}>Exportar</Button>
                    <Input type="file" id='file-upload' accept=".csv" onChange={handleFileChange} sx={{display:'none'}}></Input> 
                    <label htmlFor="file-upload"><Button variant="contained" key="dos" fullWidth component="span">Importar</Button> </label>
                    <Button variant="contained" key="tres" component={Link} sx={{marginBottom:'2rem'}} to="/agregarcliente" >Agregar</Button>
                    <Button variant="contained" key="cuatro" color='success' sx={{marginBottom:'2rem'}} onClick={handleCalculate}>Calcular</Button>
                    <Button variant="contained" key="cinco" color='error' onClick={handleOpenDeleteAll}>Borrar todo</Button>
                      <Modal
                      open={openDeleteAll}
                      onClose={handleCloseDeleteAll}
                      aria-labelledby="modal-modal-title"
                      aria-describedby="modal-modal-description"
                      >
                        <Box sx={style}>
                          <Typography variant="h6" component="div" style={{textAlign:'center'}}> ¿Desea eliminar a todos los clientes? </Typography>
                          <Typography variant="p" component="div" style={{textAlign:'center'}}> Esta acción es irreversible </Typography>
                          <Grid container spacing={2} sx={{marginTop:'2rem'}}>
                            <Grid item xs={6}>
                              <Button fullWidth='true' variant='contained'  color='success' onClick={() => handleDeleteAll()}> Sí </Button>
                            </Grid>
                            <Grid item xs={6}>
                              <Button fullWidth='true' variant='contained'  color='error' onClick={handleCloseDeleteAll}> No </Button>
                            </Grid>
                          </Grid>
                        </Box>
                      </Modal>
                      <Snackbar
                      open={open}
                      autoHideDuration={6000}
                      onClose={handleClose}
                    >
                      <SnackbarContent message={alert} action={action} sx={{backgroundColor:'blue'}}>
                      </SnackbarContent>
                    </Snackbar>
                </Stack>
              </div>
              </Grid>
              <Grid item xs={9}>
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                      <TableRow>
                        <StyledTableCell>DNI</StyledTableCell>
                        <StyledTableCell>Nombre</StyledTableCell>
                        <StyledTableCell>Distrito</StyledTableCell>
                        <StyledTableCell>Sueldo</StyledTableCell>
                        <StyledTableCell>Edad</StyledTableCell>
                        <StyledTableCell></StyledTableCell>
                        <StyledTableCell></StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {clientes.map((cliente) => (
                        <StyledTableRow key={cliente.id_cliente}>
                          <StyledTableCell component="th" scope="row"> {cliente.dni} </StyledTableCell>
                          <StyledTableCell >{cliente.nombre_cliente}</StyledTableCell>
                          <StyledTableCell >{dataDistrito[cliente.id_distrito - 1] ? dataDistrito[cliente.id_distrito - 1].nombre_distrito : 'Nombre de distrito no disponible'}</StyledTableCell>
                          <StyledTableCell >{cliente.salario}</StyledTableCell>
                          <StyledTableCell >{calcularEdad(cliente.fecha_nacimiento)}</StyledTableCell>
                          <StyledTableCell ><Button color='error' onClick={() => handleOpenDelete(cliente.id_cliente)}> Eliminar </Button></StyledTableCell>
                          <StyledTableCell ><Button onClick={() => navigate(`/agregarcliente/${cliente.id_cliente}`)}> Modificar </Button></StyledTableCell>
                            <Modal
                            open={openDelete[cliente.id_cliente] || false}
                            onClose={() => handleCloseDelete(cliente.id_cliente)}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                            >
                              <Box sx={style}>
                                <Typography variant="h6" component="div" style={{textAlign:'center'}}> ¿Desea eliminar {cliente.genero? "al cliente" : "a la clienta"} {cliente.nombre_cliente}? </Typography>
                                <Grid container spacing={2} sx={{marginTop:'2rem'}}>
                                  <Grid item xs={6}>
                                    <Button fullWidth variant='contained' color='success' onClick={() => handleDelete(cliente.id_cliente)}> Sí </Button>
                                  </Grid>
                                  <Grid item xs={6}>
                                    <Button fullWidth variant='contained' color='error' onClick={() => handleCloseDelete(cliente.id_cliente)}> No </Button>
                                  </Grid>
                                </Grid>
                              </Box>
                            </Modal>
                        </StyledTableRow>                        
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </Container>
        </>
        
    ));
}