<template>
    <v-hover v-slot="{ hover }">
        <v-card
            class="mx-auto"
            max-width="344"
            outlined
            :elevation="hover ? 6 : 2"
            :class="{ 'on-hover': hover }"
        > 
            <v-list-item three-line>
            <v-list-item-content>
                <div class="text-overline mb-4">
                    Hosted By:
                </div>
                <v-list-item-title class="text-h5 mb-1">
                {{session.users[0].name}}
                </v-list-item-title>
                <v-list-item-subtitle>{{session._id}}</v-list-item-subtitle>
            </v-list-item-content>
            </v-list-item>

            <v-card-actions>
            <v-btn
                outlined
                rounded
                text
            >
                Button
            </v-btn>
            </v-card-actions>
        </v-card>
    </v-hover>
</template>

<script>
export default {
    name:'SessionCard',
    props:{
        session: Object
    }
    ,
    data(){
        return{
            transparent: 'rgba(255, 255, 255, 0)',
        }
    }
    ,
    methods:{

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
</style>