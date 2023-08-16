<template>
  <v-card
    class="mx-auto"
    max-width="344"
  >

    <v-card-title>
      Created By: {{ session.users[0].name }}
    </v-card-title>

    <v-card-subtitle>
      {{ formatDate(session.date).formatDate }}-@{{ session.time }}
    </v-card-subtitle>

    <v-card-actions>
      <v-btn
        color="red lighten-2"
        text
        @click="deleteSession()"
      >
        <v-icon>mdi-trash-can-outline</v-icon>
      </v-btn>

      <v-spacer></v-spacer>

      <v-btn
        icon
        @click="show = !show"
      >
        <v-icon>{{ show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
      </v-btn>
    </v-card-actions>

    <v-expand-transition>
      <div v-show="show">
        <v-divider></v-divider>

        <v-card-text>
          {{ otherUsersDisplay || 'Only you' }}
        </v-card-text>
      </div>
    </v-expand-transition>
  </v-card>
</template>
<!-- <template>
  <div>
    <v-list-item three-line>
      <v-list-item-content>
        <v-list-item-title
          >Created By: {{ session.users[0].name }}</v-list-item-title
        >
        <v-list-item-subtitle>
          {{ otherUsersDisplay }}
        </v-list-item-subtitle>
        <v-list-item-subtitle>
          {{ formatDate(session.date).formatDate }}-@{{ session.time }}
        </v-list-item-subtitle>
        <v-btn id="del-btn" block small @click="deleteSession()">
          <v-icon>mdi-trash-can-outline</v-icon>
        </v-btn>
      </v-list-item-content>
    </v-list-item>
  </div>
</template> -->

<script>
import { deleteUserSession } from '@/services/sessions';
import moment from 'moment';
export default {
  name: 'SessionList',
  props: {
    session: Object,
  },
  data() {
    return {
      sessionID: '',
      otherUsersDisplay: [],
      otherUsers: [],
      show: false
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
    deleteSession() {
      deleteUserSession(this.token, this.sessionID).then(() => {
        this.$emit('refetchSessions');
      });
    },
  },
  created() {
    this.isCurrentlyActive = this.session.currentlyActive;
    this.sessionID = this.session._id;
    this.otherUsers = this.session.users.map((user) => user.name);
    this.otherUsers = this.otherUsers.slice(1);
    if (this.session.users.length > 3) {
      this.otherUsersDisplay = `${this.session.users[1].name},${this.session.users[2].name}....`;
    } else {
      this.otherUsersDisplay = this.otherUsers.join(', ');
    }
  },
};
</script>

<style scoped>
#del-btn {
  top: 10px;
}
</style>
