import React from 'react';
import { GoogleLogin } from 'react-google-login';
import { GraphQLClient } from 'graphql-request';
import { withStyles } from '@material-ui/core/styles';
// import Typography from "@material-ui/core/Typography";

const ME_QUERY = `
  {
    me {
      _id
      name
      email
      picture
    }
}
`;

const Login = ({ classes }) => {
  const onSuccess = async (user) => {
    const idToken = user.getAuthResponse().id_token;
    const client = new GraphQLClient('http://localhost:4000', {
      headers: { authorization: idToken }
    });

    const data = await client.request(ME_QUERY);
  };

  const onFailure = (reason) => {
    console.error(reason);
  };

  return (
    <GoogleLogin
      onSuccess={onSuccess}
      onFailure={onFailure}
      clientId={process.env.REACT_APP_OAUTH_CLIENT_ID}
    />
  );
};

const styles = {
  root: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center'
  }
};

export default withStyles(styles)(Login);
