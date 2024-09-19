<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-title>
                    Добавить событие
                </ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <div class="mb-4 mx-4 mt-4">
                <ion-button expand="block" @click="openModal">Выберите место</ion-button>

                <ion-card v-if="selectedPlace">
                    <ion-card-header>
                        <ion-card-title>{{ selectedPlace.title }}</ion-card-title>
                    </ion-card-header>
                    <ion-card-content>
                        {{ selectedPlace.address }}
                    </ion-card-content>
                </ion-card>
            </div>

            <div class="mb-4 mx-4 mt-4">
                <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Название
                    мероприятия</label>
                <input type="text" id="name" v-model="form.name"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="John" required />
            </div>

            <div class="mb-4 mx-4">
                <label for="description"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Описание</label>
                <input type="text" id="description" v-model="form.description"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Description" required />
            </div>

            <div class="mb-4 mx-4">
                <label for="start_time" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Момент
                    начала</label>
                <input type="datetime-local" id="start_time" v-model="form.start_time"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required />
            </div>

            <div class="mb-4 mx-4">
                <label for="end_time" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Момент
                    окончания</label>
                <input type="datetime-local" id="end_time" v-model="form.end_time"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required />
            </div>

            <div class="mb-4 mx-4">
                <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Вопросы</label>
                <div v-for="(field, index) in fields" :key="index" class="flex items-center mb-2">
                    <input type="text" v-model="fields[index]"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Type your question here" />
                    <ion-button @click="removeField(index)" color="danger" class="ml-2">Удалить</ion-button>
                </div>
                <ion-button @click="addField" color="primary">Добавить вопрос</ion-button>
            </div>

            <div class="mb-4 mx-4">
                <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Заявки на волонтерство</label>
                <ion-segment v-model="selectedSegment" value="enabled" @ionChange="segmentChanged" class="mb-4"
                    >
                    <ion-segment-button value="enabled">
                        <ion-label>Принимаются</ion-label>
                    </ion-segment-button>
                    <ion-segment-button value="disabled">
                        <ion-label>Не принимаются</ion-label>
                    </ion-segment-button>
                </ion-segment>
            </div>


            <FilePond :credits="false" :server="{
                process: (fieldName: any, file: any, metadata: any, load: any, error: any, progress: any, abort: any, transfer: any, options: any) => {
                    handleFileUpload(fieldName, file, metadata, load, error, progress, abort);
                },
            }" 
            style="margin-left: 16px; margin-right: 16px;"
            label-idle="Перетащите или загрузите изображения здесь..." allow-multiple="true" max-files="3" />

            <div class="mb-4 mx-4">
                <ion-button expand="block" @click="sendEvent">Добавить</ion-button>
            </div>

            <ion-modal :is-open="isModalOpen" @did-dismiss="closeModal">
                <ion-header>
                    <ion-toolbar>
                        <ion-title>Выбор места</ion-title>
                        <ion-buttons slot="end">
                            <ion-button @click="closeModal">Закрыть</ion-button>
                        </ion-buttons>
                    </ion-toolbar>
                </ion-header>
                <ion-content>
                    <div class="p-4">
                        <input type="text" v-model="searchQuery" placeholder="Поиск мест..."
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                        <div v-for="place in filteredPlaces" :key="place.name" class="mb-4">
                            <ion-card @click="selectPlace(place)" style="margin-left: 1px; margin-right: 1px;">
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
import axios from 'axios';
import { IonPage, IonSegment, IonSegmentButton, IonLabel, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonModal, IonButtons } from '@ionic/vue';

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

export default {
    name: 'Add',
    components: {
        IonPage,
        IonHeader,
        IonToolbar,
        IonTitle,
        IonContent,
        IonButton,
        IonCard,
        IonCardHeader,
        IonCardTitle,
        IonCardContent,
        IonModal,
        IonButtons,
        //@ts-ignore
        FilePond: vueFilePond(),
        IonSegment, IonSegmentButton, IonLabel
    },
    data() {
        return {
            selectedPlace: null,
            form: {
                name: '',
                description: '',
                start_time: '',
                end_time: '',
            },
            attachedFiles: [],
            places: [],
            isModalOpen: false,
            searchQuery: '',
            fields: []
        };
    },
    computed: {
        filteredPlaces() {
            return this.places.filter(place => place.name.toLowerCase().includes(this.searchQuery.toLowerCase()));
        }
    },
    methods: {
        openModal() {
            this.isModalOpen = true;
        },
        closeModal() {
            this.isModalOpen = false;
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
        sendEvent() {
            const eventData = {
                name: this.form.name,
                description: this.form.description,
                images: this.attachedFiles,
                start_time: this.form.start_time,
                end_time: this.form.end_time,
                place: this.selectedPlace.id,
                questions: this.fields
            };

            this.$axios.post(data.api.hostname + '/api/events/', eventData)
                .then(response => {
                    if (response.status === 201) {
                        alert('Event created successfully! ' + response.data.id);
                    }
                })
                .catch(error => {
                    console.error('Error creating event:', error);
                });
        },
        handleFileUpload(fieldName, file, metadata, load, error, progress, abort) {
            console.log(window.FormData); // Debug: Check if FormData is available
            const formData = new window.FormData(); // Explicitly use the window object
            formData.append(fieldName, file, file.name);
            const request = new XMLHttpRequest();
            alert(data.api.hostname + '/api/events/images/')
            request.open('POST', data.api.hostname + '/api/events/images/');

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
        addField() {
            this.fields.push('');
        },
        removeField(index) {
            this.fields.splice(index, 1);
        }
    },
    mounted() {
        console.log('Component mounted.');
        this.fetchPlaces();

        document.addEventListener('FilePond:processfile', (e) => {
            //@ts-ignore
            console.log('FilePond Widget Info: File Process Event', e.detail);
            //@ts-ignore
            if (e.detail.error == null) {
                console.log('File Uploaded Successfully.');
                console.log("e.detail.file: ", JSON.parse(e.detail.file.serverId))
                //@ts-ignore
                this.attachedFiles.push(JSON.parse(e.detail.file.serverId).id);
            }
            console.log("Current Attached Files: ", this.attachedFiles);
        });
    }
}
</script>

<style scoped>
/* Add your styles here */
</style>