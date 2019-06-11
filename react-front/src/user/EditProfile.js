import React, { Component } from 'react';
import { Typography, TextField, Button, Paper, Divider } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import {isAuthenticated} from '../auth';
import {read, update, updateUser} from './apiUser';
import {Redirect} from 'react-router-dom';
import DeleteUser from './DeleteUser'


const styles = theme => ({

    textField: {
      width: '100%',
      marginBottom:'16px'
    }
  });

class EditProfile extends Component {
    constructor(){
        super()
        this.state = {
            id:'',
            name:'',
            email:'',
            password:'',
            redirectToProfile: false,
            error:'',
            loading: false,
            fileSize: 0,
            about:'',
            location:''
        }
    }

    init = (userId) => {
        const token = isAuthenticated().token
        read(userId, token)
        .then(data =>{
            if(data.error){
                this.setState({redirectToProfile: true})
            }
            else{
                this.setState({
                    id: data._id, 
                    name: data.name, 
                    email: data.email, 
                    about:data.about,
                    location: data.location 
                })
            }
        })
    }

    componentDidMount(){
        this.userData = new FormData();
        const userId = this.props.match.params.userId;
        this.init(userId);  
    }

    handleChange = (name) => (event) => {
        this.setState({error:''});
        const value = name === "photo" ? event.target.files[0] : event.target.value;
        const fileSize = name === "photo" ? event.target.files[0].size : 0;
        this.userData.set(name, value)
        this.setState({[name]: value, fileSize})
      };


    isValid = () =>{
        const {name, email, password, fileSize} = this.state;
        if(name.length === 0){
            this.setState({error:'Name is required.', loading:false});
            return false
        }
        if(email.length === 0){
            this.setState({error:'Email is required.', loading:false});
            return false
        }
        if(password.length >= 1 && password.length <= 5){
            this.setState({error:'Password must contain at least 6 characters.', loading:false});
            return false
        }
        if(fileSize > 800000){
            this.setState({error:'File size must be less than 800kb', loading:false});
            return false
        }
        return true

    }

    clickSubmit = event => {
        event.preventDefault();
        this.setState({loading: true})
        if(this.isValid()){
            const userId = this.props.match.params.userId;
            const token = isAuthenticated().token;
            update(userId, token, this.userData)
            .then(data =>{
                if(data.error){
                    this.setState({error: data.error})
                }
                else{
                    updateUser(data, ()=>{
                        this.setState({
                            redirectToProfile: true
                        })
                    })
                    
                }
            });
        }
    }

    editProfileForm = (name, location, email, password, about, classes, id) => {
        const photoURL = id ? `${process.env.REACT_APP_API_URL}/user/photo/${id}?${new Date().getTime()}` : '../assets/avatar.png'
        return(
        
        <form >
          <TextField
            id="name"
            className={classes.textField}
            label="Name"
            onChange={this.handleChange("name")}
            value={name}
            />
            <TextField
                id="location"
                className={classes.textField}
                label="Location"
                onChange={this.handleChange("location")}
                value={location}
            />
            <img src={photoURL} alt='' width='300'/>
            <Typography color='textSecondary' style={{fontSize:'12px', paddingBottom:'6px'}} >
                Profile Image
            </Typography>
            <input
                onChange = {this.handleChange("photo")}
                accept="image/*"
                type="file"
                id='profileUpload'
                style= {{marginBottom:'16px'}}
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
            <TextField
                id="about"
                multiline
                className={classes.textField}
                label="About"
                onChange={this.handleChange("about")}
                value={about}
            />
        <Button
          onClick={this.clickSubmit}
          variant='contained'
          color='primary'>
            Save Edits
        </Button>
        </form>
      )
        }

    render(){
        const { classes } = this.props;
        const { id, name, location, email, password, about, error, redirectToProfile, loading} = this.state;
        if(redirectToProfile){
            return(<Redirect to={`/user/${id}`} />)
        }
        return(
            <div className='container'>
                <Typography variant='h4' style={{flexGrow:'1'}}>
                   Edit Profile
                </Typography> 
                {error}
                <Paper style={{maxWidth:'600px', padding:'16px', marginTop:'16px'}}>
                    {this.editProfileForm(name, location, email, password, about, classes, id)}
                    <br/>
                    

                    {loading ? <div>Loading...</div> : ''}
                </Paper>
                <Paper style={{maxWidth:'600px', padding:'16px', marginTop:'16px'}}>
                    <Typography variant='h5' style={{color:'#e74c3c'}}>
                        Danger Zone
                    </Typography>
                    <br/>
                    <DeleteUser userId={id} />
                </Paper>
                <br/>
         

            </div>
        )      
    }
}
export default withStyles(styles)(EditProfile);