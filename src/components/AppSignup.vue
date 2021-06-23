<template>
  <v-card
    class="my-10 pa-md-4 mx-auto"
    max-width="800"
  >
    <v-img
      class="white--text align-end"
      aspect-ratio = "2"
      src="../assets/signup-alt.png"
    >
      <v-card-title><span class = "sign-up-txt">Sign Up</span></v-card-title>
    </v-img>

    <v-card-subtitle class="pb-0">
      Create Your Account
    </v-card-subtitle>

    <v-card-text class="text--primary">
        <form>
            <v-text-field
            v-model="form.name"
            :error-messages="nameErrors"
            label="Name"
            required
            @input="$v.form.name.$touch()"
            @blur="$v.form.name.$touch()"
            ></v-text-field>

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

            <v-text-field
                v-model="form.confirmPassword"
                :append-icon="showPassC ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPassC ? 'text' : 'password'"
                name="input-10-1"
                label="Confirm Password"
                @click:append="showPassC = !showPassC"
                required
                :error-messages="confirmPasswordErrors"
                @input="$v.form.confirmPassword.$touch()"
                @blur="$v.form.confirmPassword.$touch()"
            ></v-text-field>

            <v-btn
            class="mr-4 my-1"
            @click.prevent="submit"
            color = "blue accent-3"
            rounded
            >
            <v-icon dark>
                mdi-account-plus
            </v-icon>
            </v-btn>
            <v-btn @click="clear" 
            color="red accent-2"
            rounded>
            <v-icon dark>
                 mdi-restore
            </v-icon>
            </v-btn>
        </form>
    </v-card-text>
    <v-card-actions>
       <v-btn
        class="ma-2"
        outlined
        color="teal"
        @click="navLogin"
        >
        Already Have an Account?
        </v-btn>
    </v-card-actions>
  </v-card>
</template>


<script>
  import Vue from 'vue';
  import { validationMixin } from 'vuelidate'
  import { required, minLength, email,maxLength,sameAs } from 'vuelidate/lib/validators'
  import { signup } from '@/services/auth';
  export default {
    mixins: [validationMixin],
    name:'AppSignup',
    validations: {
        form : {
              name: { 
                  required,
                  maxLength: maxLength(18)
                  },
              email: { required, email },
              password: {
                    required,
                    minLength: minLength( 8 ),
                    containsUppercase: function(value) {
                    return /[A-Z]/.test(value)
                    },
                    containsLowercase: function(value) {
                    return /[a-z]/.test(value)
                    },
                    containsNumber: function(value) {
                    return /[0-9]/.test(value)
                    },
                    containsSpecial: function(value) {
                    return /[#?!@$%^&*-]/.test(value)
                    }
                },
              confirmPassword:{
                    required,
                    sameAsPassword:sameAs('password')
                }
        }
    },

    data: () => ({
        showPass: false,
        showPassC:false,
        form:{
              name:'',
              email: '',
              password:'',
              confirmPassword:''
        }

    }),

    computed: {
      nameErrors () {
        const errors = []
        if (!this.$v.form.name.$dirty) return errors
        !this.$v.form.name.maxLength && errors.push('Name cannot exceed 18 characters')
        !this.$v.form.name.required && errors.push('Name is required')
        return errors
      },
      emailErrors () {
        const errors = []
        if (!this.$v.form.email.$dirty) return errors
        !this.$v.form.email.email && errors.push('Must be valid e-mail')
        !this.$v.form.email.required && errors.push('E-mail is required')
        return errors
      },
      passwordErrors () {
        const errors = []
        if (!this.$v.form.password.$dirty) return errors
        !this.$v.form.password.required && errors.push('Password is required')
        !this.$v.form.password.minLength && errors.push('Password should be atleast 8 characters')
        !this.$v.form.password.containsUppercase && errors.push('Password should contain atleast 1 uppercase')
        !this.$v.form.password.containsLowercase && errors.push('Password should contain atleast 1 lowercase')
        !this.$v.form.password.containsNumber && errors.push('Password should contain atleast 1 number')
        !this.$v.form.password.containsSpecial && errors.push('Password should contain atleast 1 special character')
        return errors
      },
      confirmPasswordErrors () {
        const errors = []
        if (!this.$v.form.confirmPassword.$dirty) return errors
        !this.$v.form.confirmPassword.required && errors.push('Confirmation is required')
        !this.$v.form.confirmPassword.sameAsPassword && errors.push('Should be same as password')
        return errors
      },
    },

    methods: {
      submit () {
        this.$v.$touch();
        if( !this.$v.form.$invalid ) {
            signup({ name : this.form.name , email : this.form.email , password : this.form.password })
                .then( () => {
                    Vue.$toast.success(
                        `Account has been created.
                          Login to continue...`,
                      {
                          timeout:5000
                      });
                    this.$router.push( { name: 'login' } ) 
                    })
                .catch( error => {
                    Vue.$toast.error(
                        `${error.response.data.message}`,
                    {
                        timeout:5000
                    });
                });
                } else {
                  Vue.$toast.error(
                        `Invalid Input Values.Please try again`,
                    {
                        timeout:5000
                    });
                }
      },
      clear () {
        this.$v.$reset()
        this.form.name = '';
        this.form.email = '';
        this.form.password = '';
        this.form.confirmPassword = '';
      },
      navLogin(){
        this.$router.push({name:'login'})
      }
    },
  }
</script>


<style scoped>
.sign-up-txt{
  color:#373686
}
</style>