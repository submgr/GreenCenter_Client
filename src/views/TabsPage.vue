<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="tab1" href="/tabs/Coins/Main">
          <ion-icon aria-hidden="true" :icon="flameOutline" />
          <ion-label>Бонусы</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab2" href="/tabs/PointsMap">
          <ion-icon aria-hidden="true" :icon="mapOutline" />
          <ion-label>Карта</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab3" href="/tabs/HomePage">
          <ion-icon aria-hidden="true" :icon="homeOutline" />
          <ion-label>Главная</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab4" href="/tabs/Events/Feed">
          <ion-icon aria-hidden="true" :icon="prismOutline" />
          <ion-label>Лента</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab5" href="/tabs/tab1">
          <ion-icon aria-hidden="true" :icon="albumsOutline" />
          <ion-label>Шортсы</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet } from '@ionic/vue';
import { homeOutline, prismOutline, mapOutline,
  albumsOutline, flameOutline
 } from 'ionicons/icons';
</script>
