import React from 'react';
import Head from 'next/head';
import { Button, Typography, Container } from '@mui/material';

export default function Home() {

  return (
      <div>
        <Head>
          <title>StudySync</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </Head>
        <Container>
          <Typography variant="h2" align="center" sx={{ mt: 10 }}>
            StudySync
          </Typography>
          <Typography variant="h4" align="center" sx={{ mt: 5 }}>
              LOADING...
          </Typography>
        </Container>
      </div>
  );
}