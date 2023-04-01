<template>
  <v-card class="my-10 pa-md-4 mx-auto" max-width="800">
    <v-img
      class="white--text align-end"
      aspect-ratio="1.778"
      src="../assets/login_image.jpg"
    >
      <v-card-title>Login</v-card-title>
    </v-img>

    <v-card-subtitle class="pb-0"> Login Into Your Account </v-card-subtitle>

    <v-card-text class="text--primary">
      <form>
        <v-text-field
          v-model="form.email"
          :error-messages="emailErrors"
          label="E-mail"
          required
          @input="$v.form.email.$touch()"
          @blur="$v.form.email.$touch()"
        ></v-text-field>

        <v-text-field
          v-model="form.password"
          :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showPass ? 'text' : 'password'"
          name="input-10-1"
          label="Password"
          @click:append="showPass = !showPass"
          required
          :error-messages="passwordErrors"
          @input="$v.form.password.$touch()"
          @blur="$v.form.password.$touch()"
        ></v-text-field>

        <v-btn
          class="mr-4 my-1"
          @click.prevent="submit"
          color="blue accent-3"
          rounded
        >
          <v-icon dark> mdi-login </v-icon>
        </v-btn>
        <v-btn @click="clear" color="red accent-2" rounded>
          <v-icon dark> mdi-restore </v-icon>
        </v-btn>
      </form>
    </v-card-text>
    <v-card-actions>
      <v-btn class="ma-2" outlined color="teal" @click="navSignup">
        Create an account
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
/**
 * "name": "Abhishek Kumar", "email": "abhiak@example.com", "password": "abhiAk@49"
 * "name": "John Doe", "email": "johndoe@example.com", "password": "Johndoe@123!"
 *
 */
import Vue from 'vue';
import { validationMixin } from 'vuelidate';
import { required, minLength, email } from 'vuelidate/lib/validators';

export default {
  mixins: [validationMixin],
  name: 'AppLogin',
  validations: {
    form: {
      email: { required, email },
      password: {
        required,
        minLength: minLength(8),
      },
    },
  },

  data: () => ({
    showPass: false,
    form: {
      email: '',
      password: '',
    },
  }),

  computed: {
    emailErrors() {
      const errors = [];
      if (!this.$v.form.email.$dirty) return errors;
      !this.$v.form.email.email && errors.push('Must be valid e-mail');
      !this.$v.form.email.required && errors.push('E-mail is required');
      return errors;
    },
    passwordErrors() {
      const errors = [];
      if (!this.$v.form.password.$dirty) return errors;
      !this.$v.form.password.minLength &&
        errors.push('Password should be atleast 8 characters');
      !this.$v.form.password.required && errors.push('Password is required');
      return errors;
    },
    getName() {
      return this.$store.state.auth.name;
    },
  },

  methods: {
    async submit() {
      this.$v.$touch();
      if (!this.$v.form.$invalid) {
        try {
          await this.$store.dispatch('login', this.form);
          this.$router.push({ name: 'home' });
          Vue.$toast.success(`Welcome! ${this.getName}`, {
            timeout: 5000,
          });
        } catch (error) {
          Vue.$toast.error(`${error.response.data.message}`, {
            timeout: 5000,
          });
        }
        // .then( () => {
        //     this.$router.push( { name: 'home' } )
        //       .then(()=>{
        //           Vue.$toast.success(
        //           `Welcome! ${this.getName}`,
        //         {
        //             timeout:5000
        //         });
        //       })
        // //     } )
        // .catch( error => {
        //     Vue.$toast.error(
        //         `${error.response.data.message}`,
        //     {
        //         timeout:5000
        //     });
        // });
      } else {
        Vue.$toast.error(`Invalid Input Values.Please try again`, {
          timeout: 5000,
        });
      }
    },
    clear() {
      this.$v.$reset();
      this.form.email = '';
      this.form.password = '';
    },
    navSignup() {
      this.$router.push({ name: 'signup' });
    },
  },
};
</script>
