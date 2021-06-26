<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="text-h6">
            Doodle Coop
          </v-list-item-title>
          <v-list-item-subtitle>
            Collab with people
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list
        dense
        nav
        v-if="isAuthenticated"
      >
        <v-list-item :to = "items[2].to">
            <v-list-item-icon>
              <v-icon>{{ items[2].icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ items[2].title }}</v-list-item-title>
            </v-list-item-content>
        </v-list-item>

        <v-list-item :to = "items[3].to">
            <v-list-item-icon>
              <v-icon>{{ items[3].icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ items[3].title }}</v-list-item-title>
            </v-list-item-content>
        </v-list-item>

        <v-list-item >
            <v-list-item-icon>
              <v-icon>mdi-account-lock</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <span
                      v-bind="attrs"
                      v-on="on"
                    >Logged in as :{{email}}</span>
                  </template>
                  <span>{{email}}</span>
              </v-tooltip>
              </v-list-item-title>
            </v-list-item-content>
        </v-list-item>

        <v-list-item @click = "logout">
            <v-list-item-icon>
              <v-icon>{{ items[4].icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ items[4].title }}</v-list-item-title>
            </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-list
        dense
        nav
        v-else
      >
        <v-list-item :to = "items[0].to">
            <v-list-item-icon>
              <v-icon>{{ items[0].icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ items[0].title }}</v-list-item-title>
            </v-list-item-content>
        </v-list-item>
        <v-list-item :to = "items[1].to">
            <v-list-item-icon>
              <v-icon>{{ items[1].icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ items[1].title }}</v-list-item-title>
            </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>Doodle Coop</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <router-view></router-view>
      <PortalTarget name="popup"/>
    </v-main>
  </v-app>
</template>

<script>
  export default {
    data() {
      return{
        drawer : null,
        items: [
          { title: 'Log In', icon: 'mdi-login', to: '/login'},
          { title: 'Sign Up', icon: 'mdi-account-plus' ,to: '/signup'},
          { title: 'Home', icon: 'mdi-home-lightbulb-outline' ,to: '/'},
          { title: 'Saved Canvas', icon: 'mdi-draw' ,to: '/saved'},
          { title: 'Log Out', icon: 'mdi-logout-variant' },
        ],
        right: null,
    }
  },
  computed: {
            email() {
                      return this.$store.state.auth.email;
                  },
            isAuthenticated() {
                return this.$store.getters.isAuthenticated;
            }
    },
    methods: {
        logout() {
            this.$store.dispatch( 'logout' )
                .then( () => this.$router.push( { name: 'login' } ) );
        }
    }
  }
</script>

<style scoped>
</style>