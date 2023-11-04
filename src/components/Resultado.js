import Navbar from './Navbar'
import React, { useState, useEffect } from 'react';
import{Typography, Collapse, List, ListItem, ListItemText, TableSortLabel,TablePagination,Button,Modal, Box, Grid,Table,TableBody,TableContainer,TableHead,TableRow,Paper,Container, TextField} from "@mui/material";
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import Papa from 'papaparse';
import DensityMediumSharpIcon from '@mui/icons-material/DensityMediumSharp';
import { visuallyHidden } from '@mui/utils';
import PropTypes from 'prop-types';
import Cards from './Cards';

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
  
  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }
  
  function getComparator(order, orderBy) {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }
  
  function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) {
        return order;
      }
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }
  
  const headCells = [
    {
      id: 'dni',
      numeric: false,
      disablePadding: false,
      label: 'DNI',
    },
    {
      id: 'nombre_cliente',
      numeric: false,
      disablePadding: false,
      label: 'Nombre',
    },
    {
      id: 'district',
      numeric: false,
      disablePadding: false,
      label: 'Distrito',
    },
    {
      id: 'salario',
      numeric: false,
      disablePadding: false,
      label: 'Salario',
    },
    {
      id: 'edad',
      numeric: false,
      disablePadding: false,
      label: 'Edad',
    },
    {
      id: 'percentage', //falta cambiarlo a porcentaje de morosidad
      numeric: false,
      disablePadding: false,
      label: 'Porcentaje',
    },
  ];
  
  function EnhancedTableHead(props) {
    const { order, orderBy, onRequestSort } =
      props;
    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };
  
    return (
      <TableHead>
        <TableRow>
          {headCells.map((headCell) => (
            <TableCell
              key={headCell.id}
              align={headCell.numeric ? 'right' : 'left'}
              padding={headCell.disablePadding ? 'none' : 'normal'}
              sortDirection={orderBy === headCell.id ? order : false}
              sx={{backgroundColor:'#000000'}}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)} sx={{color:'#ffffff', ':hover':{color:'#ffffff'}, '&.Mui-active':{color:'#ffffff'}, '& .MuiTableSortLabel-icon':{color:'#ffffff !important'}}}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }
  
  EnhancedTableHead.propTypes = {
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
  };

export default function Resultado(){

    // Define las variables de estado para los datos
    const [dataLoaded, setDataLoaded] = useState(false);
    const [dataDistrito, setDataDistrito] = useState([]);
    const [dataUsuario, setDataUsuario] = useState([]);
    const [dataEstadoCivil, setDataEstadoCivil] = useState([]);
    const [dataNivelEducativo, setDataNivelEducativo] = useState([]);
    const [dataRegion, setDataRegion] = useState([]);
    const [dataMotivo, setDataMotivo] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [clientesExport, setClientesExport] = useState([]);
    const [dni, setDNI] = useState(''); 
    

    const [open, setOpen] = useState([]);

      const handleOpen = (clientIndex) => {
        const newOpen= [...open];
        console.log(newOpen);
        newOpen[clientIndex] = true;
        setOpen(newOpen);
      };

      const handleClose = (clientIndex) => {
        const newOpen= [...open];
        console.log(newOpen);
        newOpen[clientIndex] = false;
        setOpen(newOpen);
      };

      const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 1000,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 5,
        p: 3,
      };

    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('percentage');
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const [openList, setOpenList] = useState(false);
  
    const handleToggle = () => {setOpenList(!openList);};

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
    useEffect(() => { loadData(); });

    const exportClients = async () => {
          let clientstoExport = [];
          clientes.forEach(element => {
            const client = ({
              id_cliente: element.id_cliente,
              nombre_cliente: element.nombre_cliente,
              dni: element.dni,
              fecha_nacimiento: element.fecha_nacimiento,
              cantidad_propiedades: element.cantidad_propiedades,
              cantidad_hijos: element.cantidad_hijos,
              genero: element.genero === 'true' ? 'Hombre' : "Mujer",
              distrito: element.id_distrito.nombre_distrito,
              usuario: element.id_usuario.nombre,
              estadocivil: element.id_estadocivil.tipo_de_estado,
              niveleducativo: element.id_niveleducativo.nivel_educativo,
              salario: element.salario,
              deudas: element.deudas,
              motivo: element.id_motivo.motivo,
            });
            clientstoExport.push(client);
          });
          console.log(clientstoExport);
          setClientesExport(clientstoExport);
      const csvData = Papa.unparse(clientesExport);
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
       
    const loadClientes = async () => {
      const response =  await fetch(process.env.REACT_APP_API_URL + '/clientes')
      const data = await response.json();
      let clients = [];
      data.forEach(element => {
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
        const distrito = dataDistrito.find((item) => item.id_distrito === element.id_distrito);
        const motivo = dataMotivo.find((item) => item.id_motivo_prestamo === element.id_motivo);
        const usuario = dataUsuario.find((item) => item.id_usuario === element.id_usuario);
        const estadocivil = dataEstadoCivil.find((item) => item.id_estado_civil === element.id_estadocivil);
        const niveleducativo = dataNivelEducativo.find((item) =>item.id_nivel_educativo === element.id_niveleducativo);
        const client = ({
          id_cliente: element.id_cliente,
          nombre_cliente: element.nombre_cliente,
          dni: element.dni,
          fecha_nacimiento: anio + "-" + mes + "-" + dia,
          cantidad_propiedades: element.cantidad_propiedades,
          cantidad_hijos: element.cantidad_hijos,
          genero: element.genero,
          id_distrito: distrito || "",
          id_usuario: usuario || "",
          id_estadocivil: estadocivil || "",
          id_niveleducativo: niveleducativo || "",
          salario: element.salario,
          deudas: element.deudas,
          id_motivo: motivo || "",
        });
        console.log(client);
        clients.push(client);
      });
      setClientes(clients);
    }

    const handleRequestSort = (event, property) => {
      const isAsc = orderBy === property && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(property);
    };

    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };

    const handleChangeDNI = (e) =>{
      const newValue = e.target.value;
      if (/^[0-9]*$/.test(newValue)) {
        setDNI(newValue);
      }
    }

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - clientes.length) : 0;

    const visibleRows = React.useMemo(
      () => {
        if (dni === '') {
          // Si el campo de DNI está vacío, mostrar todos los registros
          return stableSort(clientes, getComparator(order, orderBy)).slice(
            page * rowsPerPage,
            page * rowsPerPage + rowsPerPage
          );
        } else {
          // Si se ha ingresado un valor en el campo de DNI, filtrar los registros
          const filteredClientes = clientes.filter((cliente) =>
            cliente.dni.toLowerCase().includes(dni.toLowerCase())
          );
          console.log(filteredClientes);
          return stableSort(filteredClientes, getComparator(order, orderBy)).slice(
            page * rowsPerPage,
            page * rowsPerPage + rowsPerPage
          );
        }
      },[order, orderBy, page, rowsPerPage, clientes, dni],);

    return (dataLoaded && (
        <>
          <Navbar/>
          <Container sx={{marginBottom:'2rem'}}>
            <Typography variant='h3' textAlign='center' sx={{margin:"2rem 0"}}>
                RESULTADO DE CLIENTES MOROSOS
            </Typography>
            <Grid container spacing={2} sx={{marginTop:'2rem'}}>
              <Grid item xs={2}>
                    {/*
                    <Input type="file" id='file-upload' accept=".csv" onChange={handleFileChange} sx={{display:'none'}}></Input> 
                    <label htmlFor="file-upload"><Button variant='contained' fullWidth component="span" sx={{marginBottom:'2rem'}}>Importar</Button> </label>
                    <Button variant='contained' fullWidth component={Link} sx={{marginBottom:'2rem'}} to="/agregarcliente" >Agregar</Button>*/}
                    <Button variant='contained' fullWidth sx={{backgroundColor:"#B9B9B9", ':hover':{backgroundColor:'#B9B9B9'}}} endIcon={<DensityMediumSharpIcon />} onClick={handleToggle}>Variables evaluadas</Button>
                    <Collapse in={openList}>
                      <Paper>
                        <List>
                          <ListItem>
                            <ListItemText primary="Deudas" />
                          </ListItem>
                          <ListItem>
                            <ListItemText primary="PBI" />
                          </ListItem>
                          <ListItem>
                            <ListItemText primary="Tasa de interés" />
                          </ListItem>
                        </List>
                      </Paper>
                    </Collapse>
                    <Button variant='contained' fullWidth sx={{marginTop:'6rem', backgroundColor:"#B9B9B9", ':hover':{backgroundColor:'#B9B9B9'}}} endIcon={<DensityMediumSharpIcon />}>Filtrar</Button>
              </Grid>
              <Grid item xs={10}>
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <EnhancedTableHead
                      order={order}
                      orderBy={orderBy}
                      onRequestSort={handleRequestSort}
                      rowCount={clientes.length}
                    />
                    <TableBody>
                      {visibleRows.map((cliente, i) => (
                        <>
                          <React.Fragment key={cliente.id_cliente}>
                            <StyledTableRow key={cliente.id_cliente} onClick={() =>{handleOpen(cliente.id_cliente)}}>
                              <StyledTableCell component="th" id={cliente.id_cliente} scope="row"> {cliente.dni} </StyledTableCell>
                              <StyledTableCell >{cliente.nombre_cliente}</StyledTableCell>
                              <StyledTableCell >{cliente.id_distrito.nombre_distrito}</StyledTableCell>
                              <StyledTableCell >{cliente.salario}</StyledTableCell>
                              <StyledTableCell >{calcularEdad(cliente.fecha_nacimiento)}</StyledTableCell>
                              <StyledTableCell >{cliente.deudas}</StyledTableCell>
                            </StyledTableRow>
                          </React.Fragment>
                          <Modal
                          open={open[cliente.id_cliente] || false}
                          onClose={() => handleClose(cliente.id_cliente)}
                          aria-labelledby="modal-modal-title"
                          aria-describedby="modal-modal-description"
                          >
                            <Box sx={style}>
                                <Typography variant="h4" component="div" style={{textAlign:'center', marginBottom:'2rem'}}> Datos del cliente</Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                      <Typography variant="h5" sx={{marginBottom:'2rem'}}> <b>Nombre:</b> {cliente.nombre_cliente} </Typography>
                                      <Typography variant="h5" sx={{marginBottom:'2rem'}}> <b>DNI:</b> {cliente.dni} </Typography>
                                      <Typography variant="h5" sx={{marginBottom:'2rem'}}> <b>Fecha Nacimiento:</b> {cliente.fecha_nacimiento} </Typography>
                                      <Typography variant="h5" sx={{marginBottom:'2rem'}}> <b>Cantidad propiedades:</b> {cliente.cantidad_propiedades} </Typography>
                                      <Typography variant="h5" sx={{marginBottom:'2rem'}}> <b>Cantidad hijos:</b> {cliente.cantidad_hijos} </Typography>
                                      <Typography variant="h5" sx={{marginBottom:'2rem'}}> <b>Salario:</b> {cliente.salario} </Typography>
                                      <Typography variant="h5" sx={{marginBottom:'2rem'}}> <b>Deudas:</b> {cliente.deudas} </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                      <Typography variant="h5" sx={{marginBottom:'2rem'}}> <b>Region:</b> {dataRegion[cliente.id_distrito.id_region-1] ? dataRegion[cliente.id_distrito.id_region-1].nombre_region : "Region no disponible"} </Typography>
                                      <Typography variant="h5" sx={{marginBottom:'2rem'}}> <b>Distrito:</b> {cliente.id_distrito.nombre_distrito} </Typography>
                                      <Typography variant="h5" sx={{marginBottom:'2rem'}}> <b>Usuario:</b> {cliente.id_usuario.nombre} </Typography>                                    
                                      <Typography variant="h5" sx={{marginBottom:'2rem'}}> <b>Estado Civil:</b> {cliente.id_estadocivil.tipo_de_estado} </Typography>
                                      <Typography variant="h5" sx={{marginBottom:'2rem'}}> <b>Nivel Educativo:</b> {cliente.id_niveleducativo.nivel_educativo} </Typography>
                                      <Typography variant="h5" sx={{marginBottom:'2rem'}}> <b>Motivo:</b> {cliente.id_motivo.motivo} </Typography>

                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                          <Typography variant="h6" display="inline" sx={{ marginRight: '.4rem' }}>
                                            Recomendación
                                          </Typography>
                                          <Cards sx={{textAlign: 'center', backgroundColor: '#499BEA', width:'100%'}} texto="Rechazar solicitud" ></Cards>
                                          </Box>
                                    </Grid>                              
                                </Grid>
                              </Box>
                          </Modal>
                        </>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={clientes.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="h6" display="inline" sx={{ marginRight: '.4rem' }}>
                    DNI
                  </Typography>
                  <TextField
                    variant="outlined"
                    size="small"
                    value={dni}
                    onChange={handleChangeDNI}
                  />
                  <Button
                    variant="contained"
                    sx={{ marginLeft: '36rem' }}
                    onClick={exportClients}
                  >
                    Exportar
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </>      
    ))
}