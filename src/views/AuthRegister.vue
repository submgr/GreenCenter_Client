<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <main class="main-container">
        <div class="max-w-sm w-full text-gray-600">
          <div class="text-left">
            <div class="mt-5 space-y-2">
              <h3 class="text-gray-800 text-2xl font-bold sm:text-3xl">Регистрация</h3>
              <p class=""></p>
            </div>
          </div>
          <form @submit.prevent="handleSubmit" class="mt-8 space-y-5">
            <div>
              <label class="font-medium">Имя</label>
              <input type="text" v-model="firstName" required
                class="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg" />
            </div>
            <div style="margin-top: 15px;">
              <label class="font-medium">Фамилия</label>
              <input type="text" v-model="lastName" required
                class="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg" />
            </div>
            <div style="margin-top: 15px;">
              <label class="font-medium">Электронная почта</label>
              <input type="email" v-model="email" required
                class="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg" />
            </div>
            <div style="margin-top: 15px;">
              <label class="font-medium">Пароль</label>
              <input type="password" v-model="password" required
                class="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg" />
            </div>
            <div style="margin-top: 15px;">
              <label class="font-medium">Дата рождения</label>
              <div class="relative max-w-sm mt-2">
                <div class="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                  <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                  </svg>
                </div>
                <input datepicker id="default-datepicker" v-model="birthdate" type="date"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Select date">
              </div>
            </div>
            <button type="submit" @click="handleRegistration"
              class="w-full px-4 py-3 text-white font-medium bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-600 rounded-lg duration-150">
              Создать аккаунт
            </button>
            <button type="button" @click="goToLogin()"
              class="w-full px-2 py-3 text-black font-medium bg-slate-200 hover:bg-indigo-500 active:bg-indigo-600 rounded-lg duration-150"
              style="margin-top: 10px;">
              Войти в уже существующий
            </button>
            <div style="height: 1px; margin-top: 25vh;">
            </div>
          </form>
        </div>
      </main>
    </ion-content>
  </ion-page>
</template>

<script>
import axios from 'axios';
import data from '../modules/global.js';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, toastController } from '@ionic/vue';

export default {
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent
  },
  data() {
    const today = new Date().toISOString().split('T')[0];
    return {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      birthdate: today
    };
  },
  methods: {
    goToLogin() {
      this.$router.push({ path: '/tabs/AuthLogin' });
    },
    async handleRegistration() {
      if (!this.validateData()) {
        const toast = await toastController.create({
          message: 'Пожалуйста, заполните все поля корректно.',
          duration: 2000,
          position: 'top',
          color: 'danger'
        });

        await toast.present();
        return;
      }

      try {
        const response = await axios.post(data.api.hostname + '/api/users/', {
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
          password: this.password,
          age: this.age
        });

        if (response.status === 201) {
          // Registration successful, now request the token
          const tokenResponse = await axios.post(data.api.hostname + '/api/token/', {
            email: this.email,
            password: this.password
          });

          if (tokenResponse.status === 200) {
            const { access, refresh } = tokenResponse.data;
            localStorage.setItem('AccessToken', access);
            const toast = await toastController.create({
              message: 'Вход в систему выполнен успешно!',
              duration: 2000,
              position: 'top',
              color: 'success'
            });

            await toast.present();

            setTimeout(() => {
              this.$router.push({ path: '/tabs/HomePage' });
            }, 50);
          } else {
            const toast = await toastController.create({
              message: 'Failed to retrieve token.',
              duration: 2000,
              position: 'top',
              color: 'danger'
            });

            await toast.present();
          }
        } else {
          const toast = await toastController.create({
            message: response.data.details,
            duration: 2000,
            position: 'top',
            color: 'danger'
          });

          await toast.present();
        }
      } catch (error) {
        console.error('Error logging in:', error);
        const errorMessage = error.response && error.response.data && error.response.data.details
          ? `Error: ${error.response.data.details}`
          : 'An unknown error occurred.';
        const toast = await toastController.create({
          message: errorMessage,
          duration: 2000,
          position: 'top',
          color: 'danger'
        });

        await toast.present();
      }
    },

    validateData() {
      if (!this.firstName || !this.lastName || !this.email || !this.password || !this.birthdate) {
        return false;
      }
      // Add more validation logic as needed
      return true;
    },
    handleSubmit(event) {
      event.preventDefault();
      // Handle form submission if needed
    }
  },
  mounted() {
    // Any code that needs to run when the component is mounted
    const tabsEl = document.querySelector('ion-tab-bar');
    if (tabsEl) {
      tabsEl.hidden = true;
      tabsEl.style.height = "1";
    }
  }
};
</script>

<style scoped>
html,
body {
  height: 100%;
  margin: 0;
  overflow: hidden;
}

.main-container {
  height: 100vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 16px;
  box-sizing: border-box;
}
</style>