import { login,signup } from '@/services/auth';
const KEY_TOKEN = 'token';
const KEY_EMAIL = 'email';
const KEY_USERNAME = 'name';
// after login we receive 3 properties token,email and username ->> storing them in local storage
const auth = {
    state: {
        token: localStorage.getItem( KEY_TOKEN ) || '',
        email: localStorage.getItem( KEY_EMAIL ) || '',
        name: localStorage.getItem( KEY_USERNAME ) || '',
    },
    getters: {
        isAuthenticated( state ) {
            return !!state.token;
        }
    },
    mutations: {
        setToken( state, token ) {
            state.token = token;
        },
        setEmail( state, email ) {
            state.email = email;
        },
        setName( state, name ) {
            state.name = name;
        }
    },
    actions: {
        // credentials = { email: string, password: string }
        login( { commit }, credentials ) {
            return login( credentials )
                        .then( data => {
                            const { token,email,name} = data
        
                            localStorage.setItem( KEY_TOKEN, token );
                            localStorage.setItem( KEY_EMAIL, email );
                            localStorage.setItem( KEY_USERNAME, name );
                            
                            commit( 'setToken', token );
                            commit( 'setEmail', email );
                            commit( 'setName', name );
                            
                            return email;
                        });
        },
        signup( credentials ) {
            return signup( credentials )
                        
        },
        logout( { commit } ) {
            localStorage.removeItem( KEY_TOKEN );
            localStorage.removeItem( KEY_EMAIL );
            localStorage.removeItem( KEY_USERNAME );
        
            commit( 'setToken', '' );
            commit( 'setEmail', '' );
            commit( 'setName', '' );

            return Promise.resolve();
        }
    }
};

export default auth;