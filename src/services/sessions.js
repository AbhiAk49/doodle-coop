import axios from 'axios';
import config from '@/config';
import { successHandler, errorHandler } from './helper';

//API CALLS RELATED TO SESSIONS
export const fetchActiveSessions = (token) => {
    return axios.get( `${config.apiBaseUrl}sessions/user`,
    { 
        headers: { 'Authorization': `${token}` }

    }
     )
    .then( successHandler )
    .catch( errorHandler )
}

export const fetchInactiveSessions = (token) => {
    return axios.get( `${config.apiBaseUrl}sessions/inactive`,
    { 
        headers: { 'Authorization': `${token}` }

    }
     )
    .then( successHandler )
    .catch( errorHandler )
}

export const addSession = (token,sessionUsersList) => {
    return axios.post( `${config.apiBaseUrl}sessions/new`,sessionUsersList,
    { 
        headers: { 'Authorization': `${token}` }

    }
     )
    .then( successHandler )
    .catch( errorHandler )
}

export const deleteUserSession = (token,sessionID) => {
    return axios.delete( `${config.apiBaseUrl}sessions/delete?sessionID=${sessionID}`,
    { 
        headers: { 'Authorization': `${token}` }

    }
     )
    .then( successHandler )
    .catch( errorHandler )
}