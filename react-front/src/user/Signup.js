import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Snackbar from '@material-ui/core/Snackbar';
import {Link, Redirect} from 'react-router-dom'
import {signup, signin, authenticate, isAuthenticated} from '../auth';

const styles = theme => ({

  textField: {
    width: '100%',
    marginBottom:'16px'
  }
});

class Signup extends Component {
  constructor(){
    super()
    this.state = {
      name: '',
      email: '',
      password:'',
      error: '',
      open: false,
      redirectToHome: false,
    }
  }

  handleChange = (name) => (event) => {
    this.setState({error:''});
    this.setState({[name]: event.target.value})
  };

  clickSubmit = event => {
    event.preventDefault();
    const {name, email, password} = this.state;
    const user = {
      name,
      email,
      password
    };
    signup(user)
    .then(data =>{
      if(data.error){
        this.setState({error: data.error})
      }
      else{
        signin(user).then(data2 =>{
          console.log(data2);
            //authenticate
            authenticate(data2, ()=>{
              this.props.update_theme(isAuthenticated().user.theme)
              this.setState({redirectToHome: true})
            })
        });
      };
    });
  }


  signupForm = (name, email, password, classes) => (
    <form style={{textAlign:'center'}}>
      <TextField
        id="name"
        className={classes.textField}
        label="Name"
        onChange={this.handleChange("name")}
        value={name}
        />
      <TextField
        id="email"
        className={classes.textField}
        label="Email"
        type='email'
        onChange={this.handleChange("email")}
        value={email}
        />
      <TextField
        id="password"
        className={classes.textField}
        label="Password"
        type='password'
        onChange={this.handleChange("password")}
        value={password}
        />
      <ul style={{paddingLeft:'16px', marginTop:'0px', textAlign:'left'}}>
        <Typography variant='caption' color='textSecondary'>
          <li>Must be at least 8 characters</li>
          <li>Must contain at least one letter and one number.</li>
        </Typography>
        
      </ul>
    <Button
      type='submit'
      onClick={this.clickSubmit}
      variant='contained'
      color='primary'>
        Sign Up
    </Button>
    </form>
  )

  render() {
    const { classes } = this.props;
    const {name, email, password, redirectToHome } = this.state;
    if(redirectToHome){
      return <Redirect to='/' />
    }
    return(
      <div style={{marginTop:'16px'}}>
        <Paper className='centered padded' style={{width:'350px'}}>
          <Typography variant="h5" component="h2" style={{textAlign:'center'}}>Create Account</Typography>
          {this.signupForm(name, email, password, classes)}
          <br />
          <Typography variant='caption' color='textSecondary' style={{textAlign:'center'}}>Already have an account? <Link to='/login' style={{color:"rgba(0, 0, 0, 0.54)"}}>Login</Link></Typography>

        </Paper>
        <Snackbar
          open={this.state.error}
          message={this.state.error}
        />

      </div>
    );
  }
}
Signup.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Signup);
