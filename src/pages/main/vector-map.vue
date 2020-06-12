<template>
  <div class="map-vector-page">
    <div class="map-box" id="commonMap1"></div>
  </div>
</template>

<script>
import L from 'leaflet';
import LeafLet from 'proj4leaflet';

const copyL = Object.assign(true, {}, L);
const pro = Object.assign(true, {}, copyL.TileLayer.prototype);
copyL.TileLayer.prototype = pro;
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
  name: 'map-vector',
  data() {
    return {
      map: null,
      copyL: null
    };
  },
  mounted() {
    this.initmap();
  },
  methods: {
    initmap() {
      let origin = [-400.0, 399.99999999999977];
      let crs = new LeafLet.CRS('CPES:4990', '+proj=longlat +ellps=GRS80 +no_defs',
        { origin: origin, resolutions: resolutions });
      this.map = copyL.map('commonMap1', {
        crs: crs,
        doubleClickZoom: false,
        center: [36.408508, 108.780889],
        zoom: 2
      });
      copyL.TileLayer.TileLoad = copyL.TileLayer.extend({
        initialize: function (url, options) {
          options = copyL.setOptions(this, options);
          copyL.TileLayer.prototype.initialize.call(this, `/layers/{z}/{x}/{y}.png`, options);
        }
      });
      copyL.TileLayer.prototype.getTileUrl = function (tilePoint) {
        return copyL.Util.template(this._url, copyL.extend({
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
      copyL.tileLayer.tileLoad = function (url, options) {
        return new copyL.TileLayer.TileLoad(url, options);
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
      let tileLayer = new copyL.TileLayer.TileLoad('/layers', {
        maxZoom: resolutions.length - 1,
        minZoom: 0,
        continuousWorld: true
      }).addTo(this.map);
      // console.log(copyL.TileLayer.prototype.getTileUrl);
      // this.loadline();
    },
    async loadline() {
      let result = await fetch('/static/json/city.json').then(ret => {
        if (ret.status === 200) {
          return ret.json();
        }
      });
      copyL.geoJSON(result).addTo(this.map);
    }
  }
};
</script>

<style lang="scss" scoped>
  .map-vector-page {
    width: 100%;
    height: 100%;
    .map-box {
      width: 100%;
      height: 100%;
    }
  }
</style>
