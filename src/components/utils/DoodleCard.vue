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
        absolute
        top
        right
        :disabled="hostCheck"
        @click="deleteD"
      >
        <v-icon>mdi-trash-can-outline</v-icon>
      </v-btn>
      <v-list-item three-line>
        <v-list-item-content>
          <div class="text-overline mb-4">Title: {{ doodle.title }}</div>
          <v-img
            id="img-preview"
            max-height="150"
            max-width="250"
            :src="doodle.img64"
            @click="imgClick"
          ></v-img>
          <v-list-item-subtitle class="blue-grey--text"
            >Time : {{ doodle.time }}</v-list-item-subtitle
          >
          <v-list-item-subtitle class="blue-grey--text text--lighten-1"
            >Date :
            {{ formatDate(doodle.date).formatDate }}</v-list-item-subtitle
          >
          <v-list-item-subtitle class="grey--text text--darken-3">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <span v-bind="attrs" v-on="on">{{ otherUsersDisplay }}</span>
              </template>
              <span>{{ otherUsers.join(', ') }}</span>
            </v-tooltip>
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-card-actions> </v-card-actions>
    </v-card>
  </v-hover>
</template>

<script>
import { deleteDoodle } from '@/services/doodles';
import moment from 'moment';
export default {
  name: 'DoodleCard',
  props: {
    doodle: Object,
  },
  data() {
    return {
      transparent: 'rgba(255, 255, 255, 0)',
      otherUsersDisplay: [],
      otherUsers: [],
      hostCheck: false,
      doodleID: '',
    };
  },
  computed: {
    token() {
      return this.$store.state.auth.token;
    },
    getName() {
      return this.$store.state.auth.name;
    },
  },
  methods: {
    formatDate(date) {
      let formatDate = moment(date, 'DD/MM/YYYY').format('ddd, MMMM Do YYYY');
      return {
        formatDate,
      };
    },
    deleteD() {
      //console.log(this.doodleID);
      deleteDoodle(this.token, this.doodleID).then(() => {
        this.$emit('refetchDoodles');
      });
    },
    deleteDisabler() {
      let host = this.doodle.users[0].name;
      if (host.localeCompare(this.getName) === 0) {
        this.hostCheck = false;
        return;
      } else {
        this.hostCheck = true;
        return;
      }
    },
    imgClick() {
      this.$emit('viewImg', this.doodle.img64);
    },
  },
  created() {
    this.deleteDisabler();
    this.doodleID = this.doodle._id;
    this.otherUsers = this.doodle.users.map((user) => user.name);
    if (this.doodle.users.length > 3) {
      this.otherUsersDisplay = `${this.doodle.users[0].name},${this.doodle.users[1].name}....`;
    } else {
      this.otherUsersDisplay = this.otherUsers.join(',');
    }
  },
};
</script>

<style scoped>
.v-card {
  transition: opacity 0.4s ease-in-out;
}

.v-card:not(.on-hover) {
  opacity: 0.8;
}

.show-btns {
  color: rgba(255, 255, 255, 1) !important;
}

#del-btn {
  top: 10px;
}

#img-preview {
  cursor: pointer;
}
</style>
