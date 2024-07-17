import React from 'react';
import { Container, Typography } from '@mui/material';
import Table from './components/Table';
import propertyData from './utility/property_data.json';

const App: React.FC = () => {
  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom align="center" marginTop="2rem">
        Property Data Grid
      </Typography>
      <Table data={propertyData.data.propertiesPage.properties} />
    </Container>
  );
};

export default App;
