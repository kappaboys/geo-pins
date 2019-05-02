import React, { useContext } from 'react';
import { GoogleLogin } from 'react-google-login';
import { GraphQLClient } from 'graphql-request';
import { withStyles } from '@material-ui/core/styles';
import Typography from "@material-ui/core/Typography";

import Context from '../../context';
import { ME_QUERY } from '../../graphql/mutations';

const Login = ({ classes }) => {
  const { dispatch } = useContext(Context);
  const onSuccess = async (user) => {
    try {
      const idToken = user.getAuthResponse().id_token;
      const client = new GraphQLClient('http://localhost:4000', {
        headers: { authorization: idToken }
      });

      const { me } = await client.request(ME_QUERY);
      dispatch({ type: 'LOGIN_USER', payload: me });
    } catch (err) {
      onFailure(err);
    }
  };

  const onFailure = (err) => {
    console.error('Error logging in', err);
  };

  return (
    <div className={classes.root}>
      <Typography
        component="h1"
        variant="h3"
        gutterBottom
        noWrap
        style={{ color: 'rgb(66, 133, 244)' }}
      >
        Welcome
      </Typography>

      <GoogleLogin
        onSuccess={onSuccess}
        onFailure={onFailure}
        clientId={process.env.REACT_APP_OAUTH_CLIENT_ID}
        theme="dark"
      />
    </div>
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
