<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-title>
                    My Ionic Vue App
                </ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <div class="mb-4 mx-4 mt-4">
                <ion-button expand="block" @click="openModal">Select Place</ion-button>
                <label for="title" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Title</label>
                <input type="text" id="title" v-model="form.title"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Title" required />
            </div>

            <div class="mb-4 mx-4">
                <label for="description"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                <input type="text" id="description" v-model="form.description"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Description" required />
            </div>



            <div class="mb-4 mx-4">
                <FilePond :credits="false" :server="{
                    process: (fieldName: any, file: any, metadata: any, load: any, error: any, progress: any, abort: any, transfer: any, options: any) => {
                        handleFileUpload(fieldName, file, metadata, load, error, progress, abort);
                    },
                }" label-idle="Перетащите или загрузите изображения здесь..." allow-multiple="true" max-files="3" />
            </div>

            <ion-button expand="block" @click="saveVideo">Upload Video</ion-button>
            <ion-modal :is-open="isModalOpen" @did-dismiss="closeModal">
                <ion-header>
                    <ion-toolbar>
                        <ion-title>Select Place</ion-title>
                        <ion-buttons slot="end">
                            <ion-button @click="closeModal">Close</ion-button>
                        </ion-buttons>
                    </ion-toolbar>
                </ion-header>
                <ion-content>
                    <div class="p-4">
                        <ion-segment v-model="form.videoType">
                            <ion-segment-button value="place">
                                Место
                            </ion-segment-button>
                            <ion-segment-button value="event" @click="fetchEvents">
                                Мероприятие
                            </ion-segment-button>
                        </ion-segment>
                        <input type="text" v-model="searchQuery" placeholder="Попробуйте поиск"
                            class="mt-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                        <div v-for="place in filteredPlaces" :key="place.name" class="mb-4">
                            <ion-card @click="selectPlace(place)">
                                <ion-card-header>
                                    <ion-card-title>{{ place.name }}</ion-card-title>
                                </ion-card-header>
                                <ion-card-content>
                                    {{ place.address }}
                                </ion-card-content>
                            </ion-card>
                        </div>
                    </div>
                </ion-content>
            </ion-modal>
        </ion-content>

    </ion-page>
</template>

<script>
import { defineComponent } from 'vue';
import { toastController, IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonModal, IonSegment, IonSegmentButton } from '@ionic/vue';
import axios from 'axios';
import data from '../../modules/global.js';

import vueFilePond from 'vue-filepond';

import "filepond/dist/filepond.min.css";

// Import FilePond plugins
// Please note that you need to install these plugins separately

// Import image preview plugin styles
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css";

// Import image preview and file type validation plugins
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";

export default defineComponent({
    name: 'MyIonicVueApp',
    components: {
        IonPage,
        IonHeader,
        IonToolbar,
        IonTitle,
        IonContent,
        IonButton,
        IonSegment,
        IonSegmentButton,
        IonModal,
        //@ts-ignore
        FilePond: vueFilePond(),
    },
    data() {
        return {
            form: {
                title: '',
                description: '',
                videoType: 'place',
                videoFile: null
            },
            isModalOpen: false,
            attachedFile: null,
            searchQuery: '',
            elements: null,
            places: [],
            selectedPlace: null,
        };
    },
    computed: {
        filteredPlaces() {
            return this.places.filter(place => place.name.toLowerCase().includes(this.searchQuery.toLowerCase()));
        }
    },
    mounted() {
        this.fetchPlaces();

        document.addEventListener('FilePond:processfile', (e) => {
            //@ts-ignore
            console.log('FilePond Widget Info: File Process Event', e.detail);
            //@ts-ignore
            if (e.detail.error == null) {
                console.log('File Uploaded Successfully.');
                console.log("e.detail.file: ", JSON.parse(e.detail.file.serverId))
                //@ts-ignore
                this.attachedFile = JSON.parse(e.detail.file.serverId).id;
            }
            console.log("Current Attached Files: ", this.attachedFile);
        });
    },
    methods: {
        handleFileUpload(fieldName, file, metadata, load, error, progress, abort) {
            console.log(window.FormData); // Debug: Check if FormData is available
            const formData = new window.FormData(); // Explicitly use the window object
            formData.append(fieldName, file, file.name);
            const request = new XMLHttpRequest();
            //alert(data.api.hostname + '/api/events/images/')
            request.open('POST', data.api.hostname + '/api/videos/videofile/');

            // Add the authorization token from localStorage
            const authToken = localStorage.getItem('AccessToken');
            if (authToken) {
                request.setRequestHeader('Authorization', `Bearer ${authToken}`);
            }

            // Use the progress event to update the progress
            request.upload.onprogress = (e) => {
                progress(e.lengthComputable, e.loaded, e.total);
            };

            // Call the load method when the request is successful
            request.onload = () => {
                if (request.status >= 200 && request.status < 300) {
                    load(request.responseText);
                } else {
                    error('Upload failed');
                }
            };

            request.send(formData);

            // Return the abort method to abort the request if needed
            return {
                abort: () => {
                    request.abort();
                    abort();
                },
            };
        },
        async saveVideo() {
            console.log("saving video");
            var eventData;
            if (this.form.videoType == "event") {
                eventData = {
                    title: this.form.title,
                    description: this.form.description,
                    event: this.selectedPlace.id,
                    videofile: this.attachedFile,
                };
            }
            if (this.form.videoType == "place") {
                eventData = {
                    title: this.form.title,
                    description: this.form.description,
                    place: this.selectedPlace.id,
                    videofile: this.attachedFile,
                };
            }

            this.$axios.post(data.api.hostname + '/api/videos/', eventData)
                .then(response => async () => {
                    if (response.status === 201) {
                        //alert('Event created successfully! ' + response.data.id);
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
                    }
                })
                .catch(error => {
                    console.error('Error creating event:', error);
                });
        },
        openModal() {
            this.isModalOpen = true;
        },
        closeModal() {
            this.isModalOpen = false;
        },
        fetchPlaces() {
            this.$axios.get(data.api.hostname + '/api/places/')
                .then(response => {
                    this.places = response.data;
                    console.log(this.places);
                })
                .catch(error => {
                    console.error('Error fetching places:', error);
                });

        },
        fetchEvents() {
            this.$axios.get(data.api.hostname + '/api/events/')
                .then(response => {
                    this.places = response.data;
                    console.log(this.places);
                })
                .catch(error => {
                    console.error('Error fetching places:', error);
                });

        },
        selectPlace(place) {
            console.log("Selected place: ", place);
            this.selectedPlace = {
                title: place.name,
                address: place.address,
                id: place.id
            };
            this.closeModal();
        },
    }
});
</script>

<style scoped>
/* Add your styles here */
</style>