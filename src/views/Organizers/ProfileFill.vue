<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-title>
                    My Ionic Vue Page
                </ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <div class="mb-4 mx-4 mt-4">
                <ion-button expand="block" @click="openModal">Выбрать организацию</ion-button>

                <ion-card v-if="selectedPlace">
                    <ion-card-header>
                        <ion-card-title>{{ selectedPlace.name }}</ion-card-title>
                    </ion-card-header>
                    <ion-card-content>
                        {{ selectedPlace.inn }}<br />
                        {{ selectedPlace.info }}<br />
                    </ion-card-content>
                </ion-card>
            </div>



            <FilePond :credits="false" :server="{
                process: (fieldName: any, file: any, metadata: any, load: any, error: any, progress: any, abort: any, transfer: any, options: any) => {
                    handleFileUpload(fieldName, file, metadata, load, error, progress, abort);
                },
            }" label-idle="Добавьте подтверждающие документы..." allow-multiple="true" max-files="3" />

            <div class="mb-4 mx-4">
                <ion-button expand="block" @click="sendEvent">Отправить</ion-button>
            </div>

            <ion-modal :is-open="isModalOpen" @did-dismiss="closeModal">
                <ion-header>
                    <ion-toolbar>
                        <ion-title>Выбор организации</ion-title>
                        <ion-buttons slot="end">
                            <ion-button @click="closeModal">Закрыть</ion-button>
                        </ion-buttons>
                    </ion-toolbar>
                </ion-header>
                <ion-content>
                    <div class="p-4">
                        <input type="text" v-model="searchQuery" placeholder="Введите название или ИНН..."
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                        <div v-for="place in places" :key="place.name" class="mb-4">
                            <ion-card @click="selectPlace(place)">
                                <ion-card-header>
                                    <ion-card-title>{{ place.name }}</ion-card-title>
                                </ion-card-header>
                                <ion-card-content>
                                    {{ place.inn }}<br />
                                    {{ place.kpp }}<br />
                                    {{ place.ogrn }}
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
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonModal, IonButtons } from '@ionic/vue';

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
    },
    data() {
        return {
            selectedPlace: null,
            form: {
                name: '',
                inn: '',
                kpp: '',
                ogrn: '',
            },
            attachedFiles: [],
            places: [],
            isModalOpen: false,
            searchQuery: '',
            fields: [],
            searchTimeout: null
        };
    },
    computed: {
        filteredPlaces() {
            return this.places.filter(place => place.name.toLowerCase().includes(this.searchQuery.toLowerCase()));
        }
    },
    watch: {
        searchQuery(newQuery) {
            if (this.searchTimeout) {
                clearTimeout(this.searchTimeout);
            }
            this.searchTimeout = setTimeout(() => {
                this.fetchPlaces(newQuery);
            }, 2000);
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
                name: place.name,
                inn: place.inn,
                kpp: place.kpp,
                ogrn: place.ogrn,
            };
            this.form.name = place.name;
            this.form.inn = place.inn;
            this.form.kpp = place.kpp;
            this.form.ogrn = place.ogrn;
            this.closeModal();
        },
        fetchPlaces(searchTerm = '') {
            const url = `${data.api.hostname}/api/organizations/search/?search_term=${searchTerm}`;
            axios.get(url)
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
                inn: this.form.inn,
                kpp: this.form.kpp,
                ogrn: this.form.ogrn,
                documents: this.attachedFiles
            };

            this.$axios.post(data.api.hostname + '/api/organizations/create/', eventData)
                .then(response => {
                    if (response.status === 201) {
                        localStorage.setItem('suggestions_CreateOrganization', "turn_off");
                        //alert('Event created successfully! ' + response.data.id);
                        setTimeout(() => {
                            this.$router.push({ path: '/tabs/Events/Feed/' });
                        }, 50);
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
            request.open('POST', data.api.hostname + '/api/organizations/documents/');

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