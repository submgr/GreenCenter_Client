<template>
    <ion-page>
        <ion-content>
            <h1 style="margin-left: 22px; margin-top: 2.4rem; font-weight: 700; font-size: 34px;">Главная</h1>
            <div @click="goto('/tabs/PointsMap')"
                style="width: calc(100% - 50px); margin-left: 20px; margin-right: 15px; height: auto; border-radius: 20px; margin-top: 25px;">
                <img :src="images[0]" style="border-radius: 20px;" />
            </div>
            <div @click="goto('/tabs/tab1')"
                style="width: calc(100% - 50px); margin-left: 20px; margin-right: 15px; height: auto; border-radius: 20px; margin-top: 17px;">
                <img :src="images[1]" style="border-radius: 20px;" />
            </div>
            <div @click="goto('/tabs/Shorts/Upload')"
                style="width: calc(100% - 50px); margin-left: 20px; margin-right: 15px; height: auto; border-radius: 20px; margin-top: 25px;">
                <img :src="images[2]" style="border-radius: 20px;" />
            </div>
        </ion-content>
    </ion-page>
</template>

<script>
import { IonGrid, IonRow, IonCol, IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/vue';

export default {
    name: 'HomePage',
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
        IonGrid,
        IonRow,
        IonCol
    },
    mounted() {
        const tabsEl = document.querySelector('ion-tab-bar');
        if (tabsEl) {
            tabsEl.hidden = false;
            tabsEl.style.height = "1";
        }
    },
    methods: {
        goto(path) {
            this.$router.push(path);
        }
    },
    data() {
        return {
            images: [
                "https://i.ibb.co/1qhJ7f5/1360-3x-3.png",
                "https://i.ibb.co/C9YBBJT/1360-3x-6.png",
                "https://i.ibb.co/YyX0kyJ/Frame-1000000808-2.png"
            ]
        }
    }
};
</script>

<style scoped>
/* Add your styles here */
</style>