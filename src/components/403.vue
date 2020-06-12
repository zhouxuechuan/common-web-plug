<template>
  <div class="not-found-wrap">
    <div class="tip-info">
      <div class="info">
        <h1>抱歉！你没有权限访问该页...</h1>
        <p>
          解决方法：请联系管理员授权...
        </p>
        <el-button @click="toHomePage()">返回登录</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import MT from 'MT';

export default {
  name: 'NotFound',
  components: {},
  data() {
    return {};
  },
  created() {
  },
  methods: {
    toHomePage() {
      this.$router.push('/login');
    }
  }
};
</script>

<style lang="scss" scoped>
  .not-found-wrap {
    position: relative;
    height: 100vh;
    border: 1px solid transparent;
    .tip-info {
      position: relative;
      width: 490px;
      height: 450px;
      margin: 100px auto 80px auto;
      background: url('../../static/403.png') no-repeat;
      .info {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        text-align: center;
        color: #1c1c1c;
        h1 {
          font-size: 32px;
          font-weight: bold;
          text-align: center;
          color: #1c1c1c;
        }
        p {
          padding: 25px 0;
          font-size: 20px;
          text-align: center;
        }
      }
    }
  }
</style>
