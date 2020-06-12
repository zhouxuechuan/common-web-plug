<template>
  <div class="map-satellite-page">
    <div class="map-box" id="commonMap2"></div>
  </div>
</template>

<script>
import L from 'leaflet';
import LeafLet from 'proj4leaflet';

export default {
  name: 'map-satellite',
  data() {
    return {
      map: null
    };
  },
  mounted() {
    this.initMap();
  },
  methods: {
    initMap() {
      let url = 'http://localhost/satellite/{z}/{x}/{y}.jpg';
      let titleLayer = L.tileLayer(url, { minZoom: 1, maxZoom: 10 });
      this.map = L.map('commonMap2', {
        doubleClickZoom: false,
        center: [36.408508, 108.780889],
        zoom: 2
      }).addLayer(titleLayer);
      // console.log(L.TileLayer.prototype.getTileUrl);
    },
    async loadLine() {
      let result = await fetch('/static/json/city.json').then(ret => {
        if (ret.status === 200) {
          return ret.json();
        }
      });
      L.geoJSON(result).addTo(this.map);
    }
  }
};
</script>

<style lang="scss" scoped>
  .map-satellite-page {
    width: 100%;
    height: 100%;
    .map-box {
      width: 100%;
      height: 100%;
    }
  }
</style>
