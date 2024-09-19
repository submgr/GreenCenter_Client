<template>
    <ion-page>
      <ion-content class="ion-text-center ion-padding">
        <ion-grid>
          <ion-row>
            <ion-col>
              <img src="../../assets/graphics/icons8-event-accepted-tentatively-750.png" alt="Description Image" class="mt-16 center-image" />
              <h1 class="ion-text-bold mt-8">Вы подали заявку</h1>
              <p style="font-size: 1.1rem;">Организатор рассмотрит вашу заявку и вы получите уведомление об этом.</p>
              <ion-button @click="goBack" class="mt-8">
                Вернуться на главную
              </ion-button>
            </ion-col>
          </ion-row>
        </ion-grid>
      </ion-content>
    </ion-page>
  </template>
  
  <script>
  import { defineComponent } from 'vue';
  import { IonPage, IonContent, IonGrid, IonRow, IonCol, IonButton, IonIcon } from '@ionic/vue';
  
  export default defineComponent({
    name: 'RegistrationSent',
    components: {
      IonPage,
      IonContent,
      IonGrid,
      IonRow,
      IonCol,
      IonButton,
      IonIcon
    },
    methods: {
      goBack() {
        this.$router.push('/tabs/HomePage');
      }
    }
  });
  </script>
  
  <style scoped>
  .ion-text-bold {
    font-weight: bold;
    font-size: 1.6rem;
  }
  .center-image {
    display: block;
    margin-left: auto;
    margin-right: auto;
    max-width: 100%;
    max-height: 26vh;
  }
  </style>