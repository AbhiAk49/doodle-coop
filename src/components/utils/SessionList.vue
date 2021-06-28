<template>
    <div>
    <v-list-item three-line>
        <v-list-item-content>
            <v-list-item-title>Created By: {{session.users[0].name}}</v-list-item-title>
            <v-list-item-subtitle>
                {{otherUsersDisplay}}
            </v-list-item-subtitle>
            <v-list-item-subtitle>
            {{formatDate(session.date).formatDate}}-@{{session.time}}
            </v-list-item-subtitle>
            <v-btn
                id="del-btn"
                block
                small
                :disabled ="hostCheck"
                @click="deleteSession()"
            >
            <v-icon>mdi-trash-can-outline</v-icon>
            </v-btn>
        </v-list-item-content>
    </v-list-item>
    </div>
</template>

<script>
import {deleteUserSession} from '@/services/sessions';
import moment from 'moment';
export default {
    name:'SessionList',
    props:{
        session: Object
    }
    ,
    data(){
        return{
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
        }
    },
    created(){
        this.deleteDisabler();
        this.isCurrentlyActive = this.session.currentlyActive;   
        this.sessionID = this.session._id; 
        this.otherUsers = this.session.users.map(user=>user.name);
        this.otherUsers = this.otherUsers.slice(1);
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
#del-btn{
    top:10px;
}
</style>