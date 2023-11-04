import React from 'react';
import {Card, Typography, CardContent, CardActions} from '@mui/material';

function CardsHeader(props) {

    return (
        <Card sx={{textAlign: 'center', background: props.color}}>
            <CardContent>
                {props.icono}
                <Typography sx={{fontWeight: 'bold', fontSize: 22, color: props.font}}>
                {props.titulo}
                </Typography>

                <Typography sx={{fontSize: 18, color: props.font}}>
                {props.texto}
                </Typography>

            </CardContent>
        </Card>
    );
}

export default CardsHeader;