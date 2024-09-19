<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <main class="w-full mt-16 flex flex-col items-center justify-center px-4">
        <div class="max-w-sm w-full text-gray-600">
          <div class="text-left">
            <div class="mt-5 space-y-2">
              <h3 class="text-gray-800 text-2xl font-bold sm:text-3xl">Войти в аккаунт</h3>
              <p class="">Войдите в учетную запись, чтобы получать рекомендации, регистрироваться на мероприятия и
                получать бонусы.</p>
            </div>
          </div>
          <form @submit.prevent="login" class="mt-8 space-y-5">
            <div>
              <label class="font-medium">Электронная почта</label>
              <input v-model="email" type="email" required
                class="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg" />
            </div>
            <div>
              <label class="font-medium">Пароль</label>
              <input v-model="password" type="password" required
                class="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg" />
            </div>
            <button
              class="w-full px-4 py-3 text-white font-medium bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-600 rounded-lg duration-150">Войти</button>
            <button @click.prevent="redirectToRegister"
              class="w-full px-2 py-3 ext-black font-medium bg-slate-200 hover:bg-indigo-500 active:bg-indigo-600 rounded-lg duration-150"
              style="margin-top: 10px;">Регистрация</button>
          </form>
          <div class="relative">
            <span class="block w-full h-px bg-gray-300 mt-10"></span>
            <p class="inline-block w-fit text-sm bg-white px-2 absolute -top-2 inset-x-0 mx-auto">или продолжите с</p>
          </div>
          <div class="grid grid-cols-3 gap-x-3 mt-5" @click="checkAccessToken()">
            <div id="buttonContainerId" class="w-full" style="width: 350px;" @click="checkAccessToken()">

            </div>
          </div>
        </div>
      </main>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import axios from 'axios';
import data from '../modules/global.js';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, toastController } from '@ionic/vue';
declare const YaGames;

export default {
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent
  },
  data() {
    return {
      email: '',
      password: ''
    };
  },
  methods: {
    async login() {
      try {
        console.log(data.api.hostname);
        const response = await axios.post(data.api.hostname + '/api/token/', {
          email: this.email,
          password: this.password
        });
        const { access } = response.data;
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
      } catch (error) {
        const toast = await toastController.create({
          message: 'Ошибка при входе в систему!',
          duration: 2000,
          position: 'top',
          color: 'danger'
        });
        await toast.present();
      }

    },
    redirectToRegister() {
      this.$router.push({ path: '/tabs/AuthRegister' });
    },
    async YandexLogIn() {
      window.YaAuthSuggest.init(
        {
          client_id: "ff9bf1778b664580bdafbbf614e9253c",
          response_type: "token",
          redirect_uri: 'https://test.deqstudio.com/yandex_redirectauth.html'
        },
        "https://oauth.yandex.ru",
        { view: "default" }
      )
        .then(({ handler }) => handler())
        .then(data => console.log('Сообщение с токеном', data))
        .catch(error => console.log('Обработка ошибки', error));


    },
  },

  mounted() {
    const tabsEl = document.querySelector('ion-tab-bar');
    if (tabsEl) {
      tabsEl.hidden = true;
      tabsEl.style.height = "1";
    }

    const redirectUri = `https://test.deqstudio.com/yandex_redirectauth.html`;
    console.log("redirect_url: " + redirectUri)

    setTimeout(() => {
      window.YaAuthSuggest.init(
        {
          client_id: "ff9bf1778b664580bdafbbf614e9253c",
          response_type: "token",
          redirect_uri: redirectUri
        },
        "https://oauth.yandex.ru",
        {
          view: "button",
          parentId: "buttonContainerId",
          buttonSize: 'm',
          buttonView: 'main',
          buttonTheme: 'light',
          buttonBorderRadius: "15",
          buttonIcon: 'ya',
        }
      )
        .then(({ handler }) => handler())
        .then(data => console.log('Сообщение с токеном', data))
        .catch(error => console.log('Обработка ошибки', error));
    }, 500);

    localStorage.removeItem('AccessToken');

    setTimeout(() => {
      const intervalId = setInterval(async () => {
        console.log("Checking for Yandex ID login state...")
        if (localStorage.getItem('AccessToken')) {
          console.log("Detected auth token. Done.")
          clearInterval(intervalId);
          console.log("yandex auth success")
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
          //
        }
      }, 500);
    }, 50);
  }
};
</script>