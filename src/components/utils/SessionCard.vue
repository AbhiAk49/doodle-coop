<template>
    <v-hover v-slot="{ hover }">
        <v-card
            class="mx-auto"
            max-width="344"
            outlined
            :elevation="hover ? 6 : 2"
            :class="{ 'on-hover': hover }"
        > 
        <v-btn
            id="del-btn"
            fab
            depressed
            small
            absolute top right
            :disabled = "hostCheck"
            @click="deleteSession()"
        >
            <v-icon>mdi-trash-can-outline</v-icon>
        </v-btn>
            <v-list-item three-line>
            <v-list-item-content>
                <div class="text-overline mb-4">
                    Hosted By:
                </div>
                <v-list-item-title class="text-h5 mb-1">
                {{session.users[0].name}}
                </v-list-item-title>
                <v-list-item-subtitle class="deep-orange--text text--lighten-2">{{session._id}}</v-list-item-subtitle>
                <v-list-item-subtitle class="blue-grey--text">@{{session.time}}</v-list-item-subtitle>
                <v-list-item-subtitle class="blue-grey--text text--lighten-1">{{formatDate(session.date).formatDate}}</v-list-item-subtitle>
                <v-list-item-subtitle class="grey--text text--darken-3" >
                    <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                        <span
                        v-bind="attrs"
                        v-on="on"
                        >{{otherUsersDisplay}}</span>
                    </template>
                    <span>{{otherUsers.join(', ')}}</span>
                    </v-tooltip>
                </v-list-item-subtitle>
            </v-list-item-content>
            </v-list-item>

            <v-card-actions>
            <v-btn
                outlined
                rounded
                text
                @click="joinSession"
            >
               Join
            </v-btn>
            </v-card-actions>
        </v-card>
    </v-hover>
</template>

<script>
import {deleteUserSession} from '@/services/sessions';
import moment from 'moment';
export default {
    name:'SessionCard',
    props:{
        session: Object
    }
    ,
    data(){
        return{
            transparent: 'rgba(255, 255, 255, 0)',
            isCurrentlyActive:'',
            sessionID:'',
            otherUsersDisplay:[],
            otherUsers:[],
            hostCheck:false
        }
    }
    ,
    computed:{
        token(){
            return this.$store.state.auth.token;
        },
        getName(){
            return this.$store.state.auth.name;
        }
    },
    methods:{
        formatDate(date){
            let formatDate  =  moment(date,'DD/MM/YYYY').format("ddd, MMMM Do YYYY");
            return{
                formatDate
            }
        }
        ,
        deleteSession(){
            deleteUserSession(this.token,this.sessionID)
                .then( ()=>{this.$emit('refetchSessions')});
        }
        ,
        deleteDisabler(){
            let host  = this.session.users[0].name;
            if(host.localeCompare(this.getName)===0){
                this.hostCheck = false
                return
            }
            else{
                this.hostCheck = true
                return
            }
        },
        joinSession(){
            this.$emit('joining',this.sessionID);
        }
    },
    created(){
        this.deleteDisabler();
        this.isCurrentlyActive = this.session.currentlyActive;   
        this.sessionID = this.session._id; 
        this.otherUsers = this.session.users.map(user=>user.name);
        this.otherUsers = this.otherUsers.slice(1)
        if(this.session.users.length>3){
            this.otherUsersDisplay = `${this.session.users[1].name},${this.session.users[2].name}....`;
        }
        else{
            this.otherUsersDisplay = this.otherUsers.join(",");
        }
    }
}
</script>


<style scoped>
.v-card {
  transition: opacity .4s ease-in-out;
}

.v-card:not(.on-hover) {
  opacity: 0.8;
 }

.show-btns {
  color: rgba(255, 255, 255, 1) !important;
}

#del-btn{
    top:10px;
}
</style>