<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-title>Награды</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">

            <a href="#" style="border-radius: 20px; "
                class="mt-4 block bg-white border border-gray-200 rounded-lg shadow bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 p-4">

                <div class="text-3xl font-bold mb-2 mt-2 text-gray-900 dark:text-white">Баллы: 6</div>
            </a>

            <div class="mb-4 grid mt-4 gap-4 sm:grid-cols-2 md:mb-8 lg:grid-cols-3 xl:grid-cols-4">
                <div v-for="item in items" :key="item.id" style="border-radius: 20px;"
                    class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <div class="h-56 w-full">
                        <a href="#">
                            <img class="mx-auto h-full dark:hidden" :src="item.image" alt="" />
                            <img class="mx-auto hidden h-full dark:block" :src="item.imageDark" alt="" />
                        </a>
                    </div>
                    <div class="pt-6">
                        <div class="mb-4 flex items-center justify-between gap-4">
                            <span
                                class="me-2 pt-2 pb-2 rounded bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-black dark:bg-blue-50 dark:text-white">
                                {{ item.discount }}
                            </span>
                            <div class="flex items-center justify-end gap-1">
                                <button type="button" style="border-radius: 14px;"
                                    class="pl-4 pr-4 pt-4 pb-4 rounded-lg p-2 text-white bg-purple-500 hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-800">
                                    Обменять
                                </button>
                            </div>
                        </div>
                        <a href="#"
                            class="text-lg font-semibold leading-tight text-gray-900 hover:underline dark:text-white">
                            {{ item.title }}
                        </a>
                    </div>
                </div>
            </div>
        </ion-content>
    </ion-page>
</template>

<script>
import { defineComponent } from 'vue';
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonButton,
} from '@ionic/vue';

export default defineComponent({
    name: 'Main',
    components: {
        IonPage,
        IonHeader,
        IonToolbar,
        IonTitle,
        IonContent,
        IonGrid,
        IonRow,
        IonCol,
        IonButton,
    },
    data() {
        return {
            items: [
                {
                    id: 1,
                    image: 'https://i.ibb.co/xsfb9ZZ/d1963044-53d1-460e-93c5-02d0f4feb284-removebg-preview.png',
                    imageDark: 'path/to/image1-dark.jpg',
                    discount: 'Стоит 25 баллов',
                    title: 'Шоппер с киви',
                    rating: '5.0',
                    reviews: '455',
                },
                {
                    id: 1,
                    image: 'https://i.ibb.co/FYJJWmx/b5ec4d89-7df6-4f77-86d4-e6640711ed9c-removebg-preview.png',
                    imageDark: 'path/to/image1-dark.jpg',
                    discount: 'Стоит 20 баллов',
                    title: 'Кружка с чем-то',
                    rating: '5.0',
                    reviews: '455',
                },
                // Add more items as needed
            ],
        };
    },
    methods: {
        handleClick() {
            console.log('Button clicked');
        },
    },
});
</script>

<style scoped>
.ion-text-center {
    text-align: center;
}
</style>