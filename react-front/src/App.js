import React, { Component } from 'react';
import {BrowserRouter} from 'react-router-dom'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from "@material-ui/core/CssBaseline";
import MainRouter from './MainRouter';
import './App.css';
import { isAuthenticated }  from './auth'
import {read, update, updateUser} from './user/apiUser';


const theme = createMuiTheme({
  palette:{
    primary: {
      main: '#007d43',
      contrastText: '#fff',
    },
    background: {
      default: '#f8f8f8f8'
    },
  },
  typography: {
    useNextVariants: true,
    fontFamily: [
      'Work Sans',
      'sans-serif'
    ].join(','),
  },
});

const darktheme = createMuiTheme({
  palette:{
    primary: {
      main: '#212121',
      contrastText: '#fff',
    },
    secondary: {
      main: '#f8f8f8f8',
    },
    type: 'dark',
    background: {
      default: '#333333'
    },
  },
  typography: {
    useNextVariants: true,
    fontFamily: [
      'Work Sans',
      'sans-serif'
    ].join(','),
  },
  
});

const themes = {
  dark: darktheme,
  light: theme,
}

let applied_theme = isAuthenticated() ? themes[isAuthenticated().user.theme] : theme

class App extends Component  {

  constructor(props){
    super(props)
    this.state = {
      theme: isAuthenticated() ? isAuthenticated().user.theme : 'light',
      applied_theme: isAuthenticated() ? themes[isAuthenticated().user.theme] : theme       
    }
  }

  update_theme = (theme) => {
    this.setState({
      theme: theme,
      applied_theme: themes[theme]
    })
    const userId = isAuthenticated().user._id;
    const token = isAuthenticated().token;
    let user = new FormData();
    user.theme = theme
    update(userId, token, user).then((data)=>{
      updateUser(data, ()=>{});
    })
  }

  change_theme = (theme) => {
    this.setState({
      theme: theme,
      applied_theme: themes[theme]
    })
  }

  render() {
    return(
      <MuiThemeProvider theme={this.state.applied_theme}>
        <CssBaseline />
        <BrowserRouter>
          <MainRouter update_theme={this.update_theme}  theme={this.state.theme} change_theme={this.change_theme} />
        </BrowserRouter>
      </MuiThemeProvider>

    )
  }
};

export default App;
