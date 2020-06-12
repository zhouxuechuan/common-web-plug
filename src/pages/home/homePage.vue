<template>
  <div class="home-page">
    <div class="common-canvas" id="canvas"></div>
  </div>
</template>

<script>
import zrender from 'zrender';

export default {
  name: 'homePage',
  data() {
    return {
      bColor: ['#32C5E9', '#cf99f9'],
      zr: null,
      group: null
    };
  },
  mounted() {
    this.zr = zrender.init(document.getElementById('canvas'));
    this.init();
  },
  methods: {
    init() {
      this.group = new zrender.Group();
      this.zr.add(this.group);
      this.drawCircle();
    },
    drawCircle() {
      let r = 50;
      // 创建一个圆circle
      let circle = new zrender.Circle({
        shape: {
          cx: r, // 圆心x坐标
          cy: r, // 圆心y坐标
          r: r // 圆的半径
        },
        style: {
          fill: 'transparent', // 填充颜色，默认#000
          stroke: '#fff', // 描边颜色，默认null
          lineWidth: 2 // 线宽， 默认1
        }
      });
      // 添加圆到group里
      this.group.add(circle);
      this.doCubic(circle);
    },
    doCubic(circle) {
      let w = this.zr.getWidth();
      let h = this.zr.getHeight();
      let r = 50;
      circle.animateTo({
        shape: {
          cx: w - r, // 圆心x坐标
          cy: h - r // 圆心y坐标
        },
        style: {
          fill: 'red'
        }
        // position: [w - r, h - r]
      }, 3000, 100, 'cubicIn', () => {
        circle.shape.cx = r;
        circle.shape.cy = r;
        circle.style.fill = '#fff';
        // done
        this.doCubic(circle);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
  .home-page {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background: url("../../../static/images/demo/bg.png");
    .common-canvas {
      display: inline-block;
      width: 50%;
      height: 500px;
      border: 1px solid red;
    }
  }
</style>
