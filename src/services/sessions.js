import axios from 'axios';
import config from '@/config';
import { successHandler, errorHandler } from './helper';

//API CALLS RELATED TO MEETINGS
export const fetchUserSessions = (token) => {
    return axios.get( `${config.apiBaseUrl}newDoodle/user`,
    { 
        headers: { 'Authorization': `${token}` }

    }
     )
    .then( successHandler )
    .catch( errorHandler )
}