<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Форма</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <div style="margin-top: 14px; margin-left: 14px; margin-right: 14px;">
        <ion-segment v-model="as_volunteer" value="false">
          <ion-segment-button value="false">
            <ion-label>Участник</ion-label>
          </ion-segment-button>
          <ion-segment-button value="true">
            <ion-label>Волонтер</ion-label>
          </ion-segment-button>
        </ion-segment>
      </div>

      <ion-card style="border-radius: 20px;">
        <ion-card-header>
          <ion-card-title>Форма</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <p>Организаторы хотят задать участникам несколько вопросов, ответитьте на них, чтобы отправить заявку.</p>
          <div v-for="(question, index) in eventData.questions" :key="index">
            <ion-item>
              <ion-label>{{ question }}</ion-label>
              <ion-input v-model="answers[index]" placeholder="Ваш ответ"></ion-input>
            </ion-item>
          </div>
          <ion-button @click="sendRequest">Отправить</ion-button>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script>
import data from '../../modules/global.js';
import { defineComponent, ref, onMounted, getCurrentInstance } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonSegment, IonSegmentButton, IonLabel, IonItem, IonInput, IonButton } from '@ionic/vue';
import { useRoute } from 'vue-router';

export default defineComponent({
  name: 'RegisterForEvent',
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonItem,
    IonInput,
    IonButton
  },
  setup() {
    const { proxy } = getCurrentInstance();
    const as_volunteer = ref(false);
    const eventData = ref({ fields: [] });
    const answers = ref([]);
    const route = useRoute();
    let routeId = null;

    onMounted(async () => {
      routeId = route.params.id;
      try {
        const response = await proxy.$axios.get(data.api.hostname + `/api/events/available/${routeId}/`);
        eventData.value = response.data;
      } catch (error) {
        console.error('Error fetching event data:', error);
      }
    });

    const sendRequest = async () => {
      if (!eventData.value.questions) {
        console.error('Event data fields are not defined');
        return;
      }

      try {
        const response = await proxy.$axios.post(data.api.hostname + `/api/events/${routeId}/requests/`, {
          as_volunteer: as_volunteer.value === 'true',
          answers: answers.value
        });

        if (response.status === 200) {
          console.log('Request sent successfully');
          this.$router.push('/tabs/Events/RegistrationSent');
        }
      } catch (error) {
        console.error('Error sending request:', error);
      }
    };

    return {
      as_volunteer,
      eventData,
      answers,
      sendRequest
    };
  }
});
</script>

<style scoped>
/* Add your styles here */
</style>