import React from 'react';
import {Card, Typography, CardContent, CardActions} from '@mui/material';

function Cards(props) {
    return (
        <Card sx={props.sx}>
            <CardContent>
                <Typography  sx={{fontWeight: 'bold', fontSize: 20, color: 'white'}}>
                {props.titulo}
                </Typography>

                <Typography  sx={{fontSize: 24, color: 'white'}}>
                {props.texto}
                </Typography>
            </CardContent>
        </Card>
    );
}

export default Cards;