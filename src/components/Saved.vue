<template>
  <v-container fluid>
    <v-row
      v-if="loading"
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
    <div v-else class="mx-auto">
      <v-overlay :absolute="absolute" :value="overlay">
        <v-container fluid>
          <v-btn icon @click="overlay = false">
            <v-icon>mdi-close-circle</v-icon>
          </v-btn>
          <v-sheet rounded color="white" elevation="3">
            <v-img id="fullImg" :src="fullImgSrc"> </v-img>
          </v-sheet>
        </v-container>
      </v-overlay>
      <div v-if="checkForDoodles()">
        <v-card class="mx-0 pa-2" elevation="3" outlined shaped>
          <v-card-title
            class="text-h4 font-weight-light dark-grey--text darken-4 mb-2"
          >
            Nothing here :(
          </v-card-title>
          <v-card-subtitle> Save your Doodles first</v-card-subtitle>
        </v-card>
      </div>
      <div v-else>
        <h3 class="text-h4 font-weight-light dark-grey--text darken-4 mb-2">
          Saved Doodles
        </h3>
        <v-divider class="ma-2"></v-divider>
        <v-row>
          <template v-for="(doodle, i) in savedDoodles">
            <v-col :key="i" md="4">
              <DoodleCard
                :doodle="doodle"
                v-on:refetchDoodles="Refresh"
                v-on:viewImg="showImg"
              />
            </v-col>
          </template>
        </v-row>
      </div>
    </div>
  </v-container>
</template>

<script>
import DoodleCard from '@/components/utils/DoodleCard';
import { fetchUserDoodles } from '@/services/doodles';
export default {
  name: 'Saved',
  data: () => ({
    fullImgSrc: '',
    loading: true,
    savedDoodles: '',
    timer: '',
    absolute: true,
    overlay: false,
  }),
  components: {
    DoodleCard,
  },
  computed: {
    userEmail() {
      return this.$store.state.auth.email;
    },
    token() {
      return this.$store.state.auth.token;
    },
  },
  methods: {
    fetchDoodles() {
      this.loading = true;
      fetchUserDoodles(this.token).then((doodles) => {
        this.loading = false;
        this.savedDoodles = doodles;
      });
    },
    showImg(src) {
      this.fullImgSrc = src;
      this.overlay = !this.overlay;
    },
    Refresh() {
      this.fetchDoodles();
    },
    cancelAutoUpdate() {
      clearInterval(this.timer);
    },
    checkForDoodles() {
      if (this.savedDoodles.length === 0) {
        return true;
      } else {
        return false;
      }
    },
  },
  created() {
    this.fetchDoodles();
    this.timer = setInterval(this.fetchDoodles, 50000);
  },
  beforeDestroy() {
    this.cancelAutoUpdate();
  },
};
</script>

<style scoped>
#fullImg {
  max-width: 900px;
  width: 240px;
}
@media (min-width: 450px) {
  #fullImg {
    width: 420px;
  }
}
@media (min-width: 640px) {
  #fullImg {
    width: 620px;
  }
}
@media (min-width: 1024px) {
  #fullImg {
    width: 900px;
  }
}
</style>
