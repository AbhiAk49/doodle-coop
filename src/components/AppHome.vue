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
        <v-container fluid class="my-5">
          <v-card
          class="mx-0 pa-2"
          elevation="3"
          outlined
          shaped
        >
          <v-img class="white--text align-end"
                aspect-ratio = "1.778"
                height="100px"
                 src="../assets/foliage.png">
          <v-card-title>Create a new Session</v-card-title>
          </v-img>
          <v-card-subtitle>Add Users to new session</v-card-subtitle>
          <v-divider></v-divider>
          <v-col cols="12">
            <v-autocomplete
              v-model="selectedUsers"
              :items="users"
              dense
              chips
              small-chips
              label="Search for registered users"
              multiple
              solo
            ></v-autocomplete>
          <v-btn color="primary" @click="startSession">
            START
          </v-btn>
        </v-col>
        </v-card>
        </v-container>
      </v-row>
    </v-container>
</template>

<script>
import {getUsers} from '@/services/auth';
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
      },
      users:[],
      selectedUsers:[]

    }),
    computed: {
              token(){
            //console.log(this.$store.state.auth.token);
            return this.$store.state.auth.token;
            },
            getName(){
                return this.$store.state.auth.name;
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
        startSession(){
          console.log(this.selectedUsers);
        }
    },
    created(){
      this.fetch();
      getUsers(this.token)
                  .then(response=>{
                    this.users=response.map(user=>user.name).filter(name=>name!==this.getName);
                  })
    }
  }
</script>