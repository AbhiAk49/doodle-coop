<template>
    <v-container>
      <v-row v-if="loading"
        class="fill-height"
        align-content="center"
        justify="center"
      >
        <v-col class="ma-0 pa-0">
          <v-progress-linear
            color="deep-purple accent-4"
            indeterminate
            rounded
            height="6"
          ></v-progress-linear>
        </v-col>
      </v-row>
      <v-row v-else>
        loaded
      </v-row>
    </v-container>
</template>

<script>
import {fetchUserSessions} from '@/services/sessions';
  export default {
    name:'AppHome',
    data: () => ({
      sessions:[],
      error: null,
      loading:true,
      user:{
          name:String,
          email:String,
          token:String
      }

    }),
    computed: {
              token(){
            //console.log(this.$store.state.auth.token);
            return this.$store.state.auth.token;
        }
    },
    methods: {
      fetch(){
                fetchUserSessions(this.token)
                    .then(sessions=>{
                        this.loading=false;
                        this.sessions=sessions;
                        //console.log(this.sessions);
                    })
                    .catch( error => {
                        this.error = error;
                        this.status = 'Error';
                        this.$router.push({name:'login'});
                    });
        },
    },
    created(){
      this.fetch();
    }
  }
</script>