import React, { Component } from "react";
import { forgotPassword } from "../auth";
import { Typography, TextField, Button, Paper, Divider } from '@material-ui/core';

 
class ForgotPassword extends Component {
    state = {
        email: "",
        message: "",
        error: ""
    };
 
    forgotPassword = e => {
        e.preventDefault();
        this.setState({ message: "", error: "" });
        forgotPassword(this.state.email).then(data => {
            if (data.error) {
                console.log(data.error);
                this.setState({ error: data.error });
            } else {
                console.log(data.message);
                this.setState({ message: data.message });
            }
        });
    };
 
    render() {
        return (
            <Paper className='centered padded' style={{maxWidth:'350px', marginTop:'16px'}}>

                <h2>Ask for Password Reset</h2>
 
                {this.state.message && (
                    <h4 className="bg-success">{this.state.message}</h4>
                )}
                {this.state.error && (
                    <h4 className="bg-warning">{this.state.error}</h4>
                )}
 
                <form>
                    <TextField
                        style={{width:'100%', marginBottom:'16px'}}
                        type="email"
                        placeholder="Your email address"
                        value={this.state.email}
                        name="email"
                        onChange={e =>
                            this.setState({
                                email: e.target.value,
                                message: "",
                                error: ""
                            })
                        }
                        autoFocus
                        />
    
                    <Button
                        onClick={this.forgotPassword}
                        variant='contained'
                    >
                        Submit
                    </Button>
                </form>
            </Paper>
        );
    }
}
 
export default ForgotPassword;