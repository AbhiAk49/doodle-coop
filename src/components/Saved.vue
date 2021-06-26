<template> 
    <div>
        <v-container class="mx-auto">
            <h3>Saved Sessions</h3>
        </v-container>
    </div>
</template>

<script>
export default {
    name: 'Saved',
    data:() => ({
        
    }),
    computed: {
              userEmail(){
            return this.$store.state.auth.email;
        }
    },
    methods: {

    },
   mounted() {
   
    },
    created(){
   
    }
};
</script>

<style scoped>
</style>