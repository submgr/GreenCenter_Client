<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-title>Просмотр места</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <ion-card v-if="eventData" style="border-radius: 20px;">
                <ion-card-header>
                    <ion-card-title>{{ eventData.name }}</ion-card-title>
                </ion-card-header>
                <ion-card-content>
                    <p><b>Описание:</b> {{ eventData.description }}</p><br/>
                    <p><b>Начинается:</b> {{ eventData.start_time }}</p>
                    <p><b>Заканчивается:</b> {{ eventData.end_time }}</p>

                    <div v-if="eventData.images.length">
                        <br/>
                        <div class="image-gallery">
                            <div v-for="image in eventData.images" :key="image" class="image-item">
                                <img :src="image.filepond" class="image-thumbnail" />
                            </div>
                        </div>
                    </div>
                    <ion-button expand="block" class="mt-8" @click="goToRegistrationForEvent">Зарегистрироваться</ion-button>
                </ion-card-content>
            </ion-card>
            <div ref="mapContainer" class="map-container" style="width: calc(100% - 30px); height: 400px; border-radius: 20px; margin-left: 15px; margin-right: 15px; margin-bottom: 25px;"></div>
        </ion-content>
    </ion-page>
</template>

<script>
import axios from 'axios';
import data from '../../modules/global.js';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton } from '@ionic/vue';

import mapboxgl from 'mapbox-gl';

import '../../../node_modules/mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1Ijoic3VibWdyIiwiYSI6ImNrdzJqZHlzYjBnOHoyd3BhbjlsYjZ0M3MifQ.rPTujtQ_jehVrd8DdZTSTw';

export default {
    components: {
        IonPage,
        IonHeader,
        IonToolbar,
        IonTitle,
        IonContent,
        IonCard,
        IonCardHeader,
        IonCardTitle,
        IonCardContent
    },
    data() {
        return {
            routeId: null,
            eventData: null
        };
    },
    mounted() {
        this.routeId = this.$route.params.id;
        console.log('Route ID:', this.routeId);
        this.fetchEventData();
    },
    methods: {
        async goToRegistrationForEvent() {
            this.$router.push({ path: '/tabs/Events/View/' + this.routeId + '/Register' });
        },
        async fetchEventData() {
            try {
                const response = await axios.get(data.api.hostname + `/api/events/available/${this.routeId}/`);
                this.eventData = response.data;
            } catch (error) {
                console.error('Error fetching event data:', error);
            }

            this.$nextTick(() => {
                const mapContainer = this.$refs.mapContainer;
                if (mapContainer) {
                    const map = new mapboxgl.Map({
                        container: mapContainer,
                        style: "mapbox://styles/mapbox/streets-v12",
                        center: [this.eventData.place.lat, this.eventData.place.lon],
                        zoom: 9,
                        pitch: 60, // pitch in degrees
                        bearing: -60, // bearing in degrees
                    });

                    this.map = map;
                }
            });
        }
    },
    unmounted() {
        if (this.map) {
            this.map.remove();
            this.map = null;
        }
    }
};
</script>

<style scoped>
.image-gallery {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 10px;
    margin-top: 10px;
}

.image-item {
    border-radius: 10px;
    overflow: hidden;
}

.image-thumbnail {
    width: 100%;
    height: auto;
    display: block;
}
</style>