export const successHandler = response => response.data; //just takes response and returns its data

export const errorHandler = error => {    //just takes error and returns its msg
    console.log( error.message );
    throw error;
}
