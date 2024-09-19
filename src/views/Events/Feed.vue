<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-title>Для вас</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <div class="grid gap-8 mb-6 lg:mb-16 md:grid-cols-2" >
                <div v-for="event in events" @click="openEventCard(event.id + '')" :key="event.id" class="m-4 items-center bg-gray-50 rounded-lg shadow sm:flex dark:bg-gray-800 dark:border-gray-700">
                        <img v-if="event.images.length" :src="event.images[0].filepond" class="w-full rounded-lg sm:rounded-none sm:rounded-l-lg" :alt="event.name">

                    <div class="p-5">
                        <h3 class="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                            {{ event.name }} {{ event.id }}
                        </h3>
                        <span class="text-gray-500 dark:text-gray-400">{{ event.description }}</span>
                        <p class="mt-3 mb-4 font-light text-gray-500 dark:text-gray-400">Начало: {{ new Date(event.start_time).toLocaleString() }}</p>
                        <p class="mt-3 mb-4 font-light text-gray-500 dark:text-gray-400">Конец: {{ new Date(event.end_time).toLocaleString() }}</p>
                    </div>
                </div>
            </div>
            <ion-fab vertical="bottom" horizontal="end" slot="fixed">
                <ion-fab-button @click="redirectToAddPlace">
                    <ion-icon :icon="addOutline"></ion-icon>
                </ion-fab-button>
            </ion-fab>
        </ion-content>
    </ion-page>
</template>

<script>
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonFab, IonFabButton, IonIcon } from '@ionic/vue';
import axios from 'axios';
import data from '../../modules/global.js';

import { addOutline } from 'ionicons/icons';

export default {
    name: 'Feed',
    components: {
        IonPage,
        IonHeader,
        IonToolbar,
        IonTitle,
        IonContent,
        IonFab,
        IonFabButton,
        IonIcon
    },
    data() {
        return {
            events: [],
            addOutline
        };
    },
    mounted() {
        this.fetchEvents();
    },
    methods: {
        async fetchEvents() {
            try {
                const response = await this.$axios.get(data.api.hostname + '/api/events/available/');
                this.events = response.data;
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        },
        openEventCard(eventId) {
            console.log(eventId)
            this.$router.push({ path: `/tabs/events/View/${eventId}` });
        },
        redirectToAddPlace() {
            if(localStorage.getItem('suggestions_CreateOrganization') && localStorage.getItem('suggestions_CreateOrganization') == "turn_off"){
                this.$router.push({ path: '/tabs/Events/Add' });
            }else{
                this.$router.push({ path: '/tabs/Organizers/ProfileFill' });
            }
            
        }
    }
};
</script>