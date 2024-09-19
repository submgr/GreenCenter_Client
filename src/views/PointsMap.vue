<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-title>События рядом</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <div ref="mapContainer" class="map-container" style="width: 100vw; height: 90vh; border-radius: 0; margin: 0;"></div>
        </ion-content>
    </ion-page>
</template>

<script>
import axios from 'axios';
import data from '../modules/global.js';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonList, IonItem, IonThumbnail } from '@ionic/vue';

import mapboxgl from 'mapbox-gl';

import '../../node_modules/mapbox-gl/dist/mapbox-gl.css';

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
        IonCardContent,
        IonList,
        IonItem,
        IonThumbnail
    },
    data() {
        return {
            routeId: null,
            eventData: null,
            map: null
        };
    },
    mounted() {
        this.routeId = this.$route.params.id;
        console.log('Route ID:', this.routeId);
        this.fetchEventData();
    },
    methods: {
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
                        center: [37.6176, 55.7510],
                        zoom: 15,
                        pitch: 60, // pitch in degrees
                        bearing: -60, // bearing in degrees
                    });

                    this.map = map;
                    this.addRandomPoints();
                }
            });
        },
        addRandomPoints() {
            const bounds = this.map.getBounds();
            const points = 10; // Number of random points

            for (let i = 0; i < points; i++) {
                const lng = bounds.getWest() + (bounds.getEast() - bounds.getWest()) * Math.random();
                const lat = bounds.getSouth() + (bounds.getNorth() - bounds.getSouth()) * Math.random();

                const marker = new mapboxgl.Marker()
                    .setLngLat([lng, lat])
                    .addTo(this.map);

                marker.getElement().addEventListener('click', () => {
                    //alert(`Marker at [${lng}, ${lat}] clicked!`);
                });
            }
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
.map-container {
    overflow-y: hidden; /* Hide vertical scrollbar */
}
</style>