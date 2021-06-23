import axios from 'axios';
import config from '@/config';
import { successHandler, errorHandler } from './helper';

const KEY_TOKEN = 'token';
const KEY_EMAIL = 'email';
const KEY_USERNAME = 'name';
const getUsers = (token)=>{
    return axios.get(
        `${config.apiBaseUrl}users`,
        {   
            headers: { 'Authorization': `${token}`,
         }
        }
    ).then( successHandler )
    .catch( errorHandler );
}
const login = ( credentials ) => {
    return axios.post(
                `${config.apiBaseUrl}auth/login`,
                credentials,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            )
                .then( successHandler )
                .catch( errorHandler );
};
const signup = ( credentials ) => {
    return axios.post(
                `${config.apiBaseUrl}auth/register`,
                credentials,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            )
                .then( successHandler )
                .catch( errorHandler );
};

const logout = () => {
    localStorage.removeItem( KEY_TOKEN );
    localStorage.removeItem( KEY_EMAIL );
    localStorage.removeItem( KEY_USERNAME );
};

const isAuthenticated = () => {
    return !!localStorage.getItem( KEY_TOKEN );
};

const getEmail = () => {
    return ( localStorage.getItem( KEY_EMAIL ) );
};
const getUName = () => {
    return ( localStorage.getItem( KEY_USERNAME ) );
};

const getToken = () => {
    return (localStorage.getItem( KEY_TOKEN ));
};


export {
    login,
    logout,
    isAuthenticated,
    getToken,
    getEmail,
    getUName,
    getUsers,
    signup
};