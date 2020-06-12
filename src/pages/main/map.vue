<template>
  <div class="map-page">
    <div class="map-box" id="commonMap1"></div>
    <button class="show-btn" @click="changeCrs">
      Toggle
    </button>
  </div>
</template>

<script>
import * as L from 'leaflet';
import LeafLet from 'proj4leaflet';
import MT from 'MT';
export default {
  name: 'MapPage',
  data() {
    return {
      getDefaultUrl: null,
      map1: null,
      map2: null,
      normalMap: null,
      imgMap: null,
      show: true
    };
  },
  mounted() {
    this.initMap();
  },
  methods: {
    initSateMap() {
      if (!this.map1) {
        this.map1 = L.map('commonMap1', {
          doubleClickZoom: false,
          center: [36.408508, 108.780889],
          zoom: 6
        });
      }
      L.TileLayer.prototype.getTileUrl = function (tilePoint) {
        return L.Util.template(this._url, L.extend({
          s: this._getSubdomain(tilePoint),
          z: tilePoint.z,
          x: tilePoint.x,
          y: tilePoint.y
        }, this.options));
      };
      let url = 'http://localhost/satellite/{z}/{x}/{y}.jpg';
      let titleLayer = L.tileLayer(url, { minZoom: 4, maxZoom: 10 });
      this.map1.addLayer(titleLayer);
    },
    initMap() {
      var normalMapm = L.tileLayer('http://t3.tianditu.com/vec_c/wmts?layer=vec&style=default&tilematrixset=c&Service=WMTS&Request=GetTile&Version=1.0.0&Format=tiles&TileMatrix={z}&TileCol={x}&TileRow={y}&tk=8343b0d2e580905de938231bd201012f', {
        maxZoom: 13,
        minZoom: 2,
        zoomOffset: 1
      });
      var normalMapa = L.tileLayer('http://t0.tianditu.gov.cn/cva_c/wmts?layer=cva&style=default&tilematrixset=c&Service=WMTS&Request=GetTile&Version=1.0.0&Format=tiles&TileMatrix={z}&TileCol={x}&TileRow={y}&tk=8343b0d2e580905de938231bd201012f', {
        maxZoom: 13,
        minZoom: 2,
        zoomOffset: 1
      });
      var imgMapm = L.tileLayer('http://t0.tianditu.gov.cn/img_c/wmts?layer=img&style=default&tilematrixset=c&Service=WMTS&Request=GetTile&Version=1.0.0&Format=tiles&TileMatrix={z}&TileCol={x}&TileRow={y}&tk=8343b0d2e580905de938231bd201012f', {
        maxZoom: 13,
        minZoom: 2,
        zoomOffset: 1
      });
      // var imgMapa = L.tileLayer('http://t0.tianditu.gov.cn/cia_c/wmts?layer=cia&style=default&tilematrixset=c&Service=WMTS&Request=GetTile&Version=1.0.0&Format=tiles&TileMatrix={z}&TileCol={x}&TileRow={y}&tk=8343b0d2e580905de938231bd201012f', {
      //     maxZoom: 13,
      //     minZoom: 5,
      //     zoomOffset: 1
      // });
      this.normalMap = L.layerGroup([normalMapm, normalMapa]);
      this.imgMap = L.layerGroup([imgMapm]);
      this.map = L.map('commonMap1', {
        crs: L.CRS.EPSG4326,
        center: [35.608508, 108.780889],
        zoom: 4,
        layers: [this.normalMap],
        zoomControl: false
      });
    },
    async loadLine() {
      let result = await fetch('/static/json/city.json').then(ret => {
        if (ret.status === 200) {
          return ret.json();
        }
      });
      L.geoJSON(result).addTo(this.map1);
    },
    changeCrs() {
      this.show = !this.show;
      if (this.show) {
        this.initMap();
      } else {
        this.initSateMap();
      }
    },
    async loadLine1() {
      let result = await fetch('/static/json/province.json').then(ret => {
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
  .map-page {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    .map-box {
      width: 100%;
      height: 100%;
      border: 1px solid red;
    }
    .show-btn {
      position: absolute;
      bottom: 20px;
      z-index: 999;
    }
    .fade-enter-active, .fade-leave-active {
      transition: opacity .5s;
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
    {
      opacity: 0;
    }
  }
</style>
