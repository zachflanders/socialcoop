import React from 'react';
import {BrowserRouter} from 'react-router-dom'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import MainRouter from './MainRouter';
import './App.css';

const theme = createMuiTheme({
  palette:{
    primary: {
      main: '#4CAF50',
      contrastText: '#fff',
    }
  },
  typography: {
    useNextVariants: true,
    fontFamily: [
      'Work Sans',
      'sans-serif'
    ].join(','),
  },
});

const App = () => (
  <MuiThemeProvider theme={theme}>
    <BrowserRouter>
      <MainRouter />
    </BrowserRouter>
  </MuiThemeProvider>

);

export default App;
