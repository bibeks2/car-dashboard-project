import React from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Paper } from '@mui/material';

const DetailedCarPage = () => {
    const { id } = useParams();

    return (
        <Container>
            <Paper sx={{p: 4}}>
                <Typography variant="h4">Detailed View</Typography>
                <Typography>
                    This is the detailed view page for a specific car.
                    The ID for this car is: <strong>{id}</strong>.
                </Typography>
                <Typography sx={{mt: 2}}>
                    A creative, dynamic visual experience responding to user input could be implemented here.
                </Typography>
            </Paper>
        </Container>
    );
};

export default DetailedCarPage;