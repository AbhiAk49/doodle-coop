<template> 
    <div>
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
        <v-container v-else class="mx-auto">
            <h3>Saved Doodles</h3>
        </v-container>
    </div>
</template>

<script>
import {fetchUserDoodles} from '@/services/doodles';
export default {
    name: 'Saved',
    data:() => ({
        loading:true,
        savedDoodles:''
    }),
    computed: {
        userEmail(){
            return this.$store.state.auth.email;
        },
        token(){
            return this.$store.state.auth.token;
        }
    },
    methods: {

    },
   mounted() {
   
    },
    created(){
        fetchUserDoodles(this.token)
            .then(doodles=>{
                this.loading = false;
                this.savedDoodles = doodles;
                console.log(doodles);
            })
    }
};
</script>

<style scoped>
</style>