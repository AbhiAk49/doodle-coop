import axios from 'axios';
import config from '@/config';
import { successHandler, errorHandler } from './helper';

//API CALLS RELATED TO DOODLES
export const fetchUserDoodles = (token) => {
    return axios.get( `${config.apiBaseUrl}doodles/user`,
    { 
        headers: { 'Authorization': `${token}` }

    }
     )
    .then( successHandler )
    .catch( errorHandler )
}

export const saveDoodle = (token,doodleDetails) => {
    return axios.post( `${config.apiBaseUrl}doodles/save`,doodleDetails,
    { 
        headers: { 'Authorization': `${token}` }

    }
     )
    .then( successHandler )
    .catch( errorHandler )
}

export const deleteDoodle = (token,doodleID) => {
    return axios.delete( `${config.apiBaseUrl}doodles/delete?doodleID=${doodleID}`,
    { 
        headers: { 'Authorization': `${token}` }

    }
     )
    .then( successHandler )
    .catch( errorHandler )
}