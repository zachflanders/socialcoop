import React, { Component } from "react";
import { resetPassword } from "../auth";
import { Typography, TextField, Button, Paper, Divider } from '@material-ui/core';

 
class ResetPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newPassword: "",
            message: "",
            error: ""
        };
    }
 
    resetPassword = e => {
        e.preventDefault();
        this.setState({ message: "", error: "" });
 
        resetPassword({
            newPassword: this.state.newPassword,
            resetPasswordLink: this.props.match.params.resetPasswordToken
        }).then(data => {
            if (data.error) {
                console.log(data.error);
                this.setState({ error: data.error });
            } else {
                console.log(data.message);
                this.setState({ message: data.message, newPassword: "" });
            }
        });
    };
 
    render() {
        return (
            <Paper className='centered padded' style={{maxWidth:'350px', marginTop:'16px'}}>
                <h2>Reset your Password</h2>
 
                {this.state.message && (
                    <h4>{this.state.message}</h4>
                )}
                {this.state.error && (
                    <h4>{this.state.error}</h4>
                )}
 
                <form>
                    <TextField
                        style={{width:'100%', marginBottom:'16px'}}
                        type="password"
                        placeholder="Your new password"
                        value={this.state.newPassword}
                        name="newPassword"
                        onChange={e =>
                            this.setState({
                                newPassword: e.target.value,
                                message: "",
                                error: ""
                            })
                        }
                        autoFocus
                    />
                    <Button
                        variant='contained'
                        onClick={this.resetPassword}
                    >
                        Reset Password
                    </Button>
                </form>
            </Paper>
        );
    }
}
 
export default ResetPassword;