<template>
    <div class="py-1">
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
        <v-container fluid class="ma-5">
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
        <v-divider class="ma-5"></v-divider>
        <div v-if="checkForSessions()">
          <h3 class="text-h4 font-weight-light dark-grey--text darken-4 mb-2">
          No sessions were found
        </h3>
        </div>
        <div v-else>
          <h3 class="text-h4 font-weight-light dark-grey--text darken-4 mb-2">
          Available Sessions
          </h3>
          <v-row>
            <template v-for="(session, i) in activeSessions">
              <v-col
                :key="i"
                md="4"
              >
                <SessionCard :session = session v-on:refetchSessions="Refresh" v-on:joining="onJoin"/>
              </v-col>
            </template>
          </v-row>
        </div>
        </v-container>
      </v-row>
      <v-row>
          <v-divider class="ma-5"></v-divider>
            <v-container fluid class="ma-5">
              <v-expansion-panels>
                <v-expansion-panel>
                  <v-expansion-panel-header @click="fetchPastSessions">
                  <h3 class="text-h4 font-weight-light dark-grey--text darken-4 mb-2">
                    View Previous Sessions
                  </h3>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <v-row v-if="pastSessionLoading"
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
                    <div v-else align="center">
                      <div v-if="checkForInactiveSessions()">
                        <div class="font-weight-light dark-grey--text darken-4 mb-2">
                        No sessions were found
                        </div>
                      </div>
                    <v-row v-else>
                        <template v-for="(session, i) in inactiveSessions">
                        <v-col :key="i" cols=12>
                          <SessionList :session = session v-on:refetchSessions="updateInactive"/>
                        </v-col>
                      </template>
                    </v-row>
                    </div>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>    
            </v-container>
      </v-row>
    </div>
</template>

<script>
import Vue from 'vue';
import {getUsers} from '@/services/auth';
import {fetchActiveSessions,addSession,fetchInactiveSessions} from '@/services/sessions';
import SessionCard from '@/components/utils/SessionCard';
import SessionList from '@/components/utils/SessionList';
  export default {
    name:'AppHome',
    components:{
      SessionCard,
      SessionList
    },
    data: () => ({
      activeSessions:[],
      inactiveSessions:[],
      error: null,
      loading:true,
      pastSessionLoading:true,
      user:{
          name:String,
          email:String,
          token:String
      },
      users:[],
      selectedUsers:[],
      timer:''
    }),
    computed: {
              token(){
            return this.$store.state.auth.token;
            },
            getName(){
                return this.$store.state.auth.name;
            }
    },
    methods: {
      fetch(){  this.loading = true;
                fetchActiveSessions(this.token)
                    .then(sessions=>{
                        this.loading=false;
                        this.activeSessions=sessions;
                        this.checkForSessions();
                    })
                    .catch( error => {
                        this.error = error;
                        Vue.$toast.error(
                        `${error.response.data.message}`,{timeout:5000}
                        );
                        this.$router.push({name:'login'});
                    });
        },
        fetchPastSessions(){
          fetchInactiveSessions(this.token)
            .then((sessions)=>{
              this.inactiveSessions = sessions;
              this.pastSessionLoading = false;
            });
        },
        updateInactive(){
          this.fetchPastSessions();
        },
        startSession(){
          addSession(this.token,this.selectedUsers)
            .then((session)=>{
              this.$router.push( 
                { path: `/doodle/${session._id}`} );
            })
        },
        Refresh(){
          this.fetch();
        },
        onJoin(id){
          this.$router.push( { path: `/doodle/${id}` } );
        },
        checkForSessions(){
            if(this.activeSessions.length===0){
                return true;
            }
            else{
                return false
            }
        },
        checkForInactiveSessions(){
            if(this.inactiveSessions.length===0){
                return true;
            }
            else{
                return false
            }
        },
        cancelAutoUpdate(){
          clearInterval(this.timer);
        }
    },
    created(){
      this.fetch();
      this.timer = setInterval(this.fetch,50000);
      getUsers(this.token)
                  .then(response=>{
                    this.users=response.map(user=>user.name).filter(name=>name!==this.getName);
                  })
    },
    beforeDestroy(){
      this.cancelAutoUpdate();
    }
  }
</script>
