<template>
  <div class="map-page">
    <transition name="fade">
      <div v-show="show" class="map-box" id="commonMap1"></div>
    </transition>
    <transition name="fade">
      <div v-show="!show" class="map-box" id="commonMap2"></div>
    </transition>
    <button class="show-btn" @click="changeCrs">
      Toggle
    </button>
  </div>
</template>

<script>
import * as L from 'leaflet';
import LeafLet from 'proj4leaflet';
import MT from 'MT';
// import { mapDataList } from './mapData/map1';
const resolutions = [
  0.09517844023321122,
  0.05948652514575701,
  0.0356919150874542,
  0.023794610058302804,
  0.01665622704081196,
  0.011897305029151402,
  0.01070757452623626,
  0.007138383017490841,
  0.005948652514575701,
  0.00475892201166056,
  0.0035691915087454206,
  0.0028553532069963364,
  0.00237946100583028,
  0.0019035688046642242,
  0.0014276766034981682,
  0.00118973050291514
];
export default {
  name: 'MapPage',
  data() {
    return {
      getDefaultUrl: null,
      map1: null,
      map2: null,
      show: true
    };
  },
  mounted() {
    // const getDefaultUrl = L.TileLayer.prototype.getTileUrl;
    // console.log(getDefaultUrl);
    this.initMap();
  },
  methods: {
    initMap() {
      let origin = [-400.0, 399.99999999999977];
      let crs = new LeafLet.CRS('CPES:4990', '+proj=longlat +ellps=GRS80 +no_defs',
        { origin: origin, resolutions: resolutions });
      this.map1 = L.map('commonMap1', {
        crs: crs,
        doubleClickZoom: false,
        center: [36.408508, 108.780889],
        zoom: 2
      });
      L.TileLayer.TileLoad = L.TileLayer.extend({
        initialize: function (url, options) {
          options = L.setOptions(this, options);
          L.TileLayer.prototype.initialize.call(this, `/layers/{z}/{x}/{y}.png`, options);
        }
      });
      L.TileLayer.prototype.getTileUrl = function (tilePoint) {
        return L.Util.template(this._url, L.extend({
          s: this._getSubdomain(tilePoint),
          z: function () {
            let value = tilePoint.z.toString(10);
            return 'L' + padL(value);
          },
          x: function () {
            let value = tilePoint.y.toString(16);
            return 'R' + pad(value, 8);
          },
          y: function () {
            let value = tilePoint.x.toString(16);
            return 'C' + pad(value, 8);
          }
        }));
      };
      L.tileLayer.tileLoad = function (url, options) {
        return new L.TileLayer.TileLoad(url, options);
      };
      let pad = function (numStr, n) {
        let len = numStr.length;
        while (len < n) {
          numStr = '0' + numStr;
          len++;
        }
        return numStr;
      };
      let padL = function (numStr) {
        if (numStr < 10) {
          numStr = '0' + numStr;
        }
        return numStr;
      };
      let tileLayer = new L.TileLayer.TileLoad('/layers', {
        maxZoom: resolutions.length - 1,
        minZoom: 0,
        continuousWorld: true
      }).addTo(this.map1);
      let url = 'http://localhost/satellite/{z}/{x}/{y}.jpg';
      let titleLayer = L.tileLayer(url, { minZoom: 1, maxZoom: 10 });
      this.map2 = L.map('commonMap2', {
        doubleClickZoom: false,
        center: [36.408508, 108.780889],
        zoom: 2
      }).addLayer(titleLayer);
      this.loadLine();
    },
    async loadMarker() {
      let icon = L.icon({
        iconUrl: '/static/images/demo/0503.png',
        iconSize: [5, 5],
        shadowUrl: 'my-icon.png'
      });
      let markerList = [];
      let result = await fetch('/static/json/cimiss_station_info.json').then(ret => {
        if (ret.status === 200) {
          return ret.json();
        }
      });
      result['RECORDS'].forEach(item => {
        // if (!item.lat) {
        //   console.log(item);
        // }
        markerList.push(L.marker([item.lat, item.lon], { icon: icon }));
      });
      L.layerGroup(markerList).addTo(this.map);
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
