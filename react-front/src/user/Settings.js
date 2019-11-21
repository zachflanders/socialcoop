import React, { Component } from 'react';
import { Typography, TextField, Button, Paper, Divider, FormControlLabel, Checkbox } from '@material-ui/core';
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

class Settings extends Component {
    constructor(){
        super()
        this.state = {
            id:'',
            name:'',
            redirectToProfile: false,
            error:'',
            loading: false,
            showInDirectory: false
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
                    showInDirectory: data.showInDirectory || false 
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
        console.log(event.target.checked);
        const value = event.target.checked;
        this.userData.set(name, value)
        this.setState({[name]: value})
      };


    clickSubmit = event => {
        event.preventDefault();
        this.setState({loading: true})
        const userId = this.props.match.params.userId;
        const token = isAuthenticated().token;
        update(userId, token, this.userData)
        .then(data =>{
            if(data.error){
                console.log(data.error.message);
                this.setState({error: data.error.message})
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

    editProfileForm = (showInDirectory) => {
        return(
        <form >
            <FormControlLabel
                control={
                <Checkbox checked={showInDirectory} onChange={this.handleChange('showInDirectory')} value={'showInDirectory'} />
                }
                label="Show in Directory/Search"
            />
            <br />
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
        const { id, name, showInDirectory,error, redirectToProfile, loading} = this.state;
        if(redirectToProfile){
            return(<Redirect to={`/user/${id}`} />)
        }
        return(
            <div className='container'>
                <Typography variant='h4' style={{flexGrow:'1'}}>
                   Settings
                </Typography> 
                {error}
                <Paper style={{maxWidth:'600px', padding:'16px', marginTop:'16px'}}>
                    {this.editProfileForm(showInDirectory)}
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
export default withStyles(styles)(Settings);