<template>
  <div class="login-page-wrap">
    <div class="core-table">
      <div class="left-part"></div>
      <div class="right-part">
        <div v-loading="loading" class="right-inner">
          <div class="word-title"></div>
          <el-form ref="formRule" :model="formRule" :rules="rules" status-icon label-width="3px"
                   class="rule-form">
            <el-form-item label prop="username">
              <el-input
                v-model="formRule.username"
                class="name-input"
                placeholder="用户名"
                prefix-icon="el-icon-user"
                clearable
                @keyup.enter.native="signIn('formRule')"
              />
            </el-form-item>
            <el-form-item label prop="password">
              <el-input
                v-model="formRule.password"
                class="pwd-input"
                placeholder="密码"
                prefix-icon="el-icon-lock"
                type="password"
                clearable
                @keyup.enter.native="signIn('formRule')"
              />
            </el-form-item>
            <div class="remember-form">
              <el-checkbox v-model="remember">7天内自动登录</el-checkbox>
              <span class="forget" @click="dialog.visible = true">忘记密码</span>
            </div>
            <el-form-item>
              <el-button class="login-btn" @click="signIn('formRule')">登 &nbsp; &nbsp;录</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <div class="footer">
    </div>
    <el-dialog
      :title="dialog.title"
      :visible.sync="dialog.visible"
      :showClose="false"
      class="forget-dialog"
      width="400px"
    >
      <div class="dialog-text">
        请联系管理员！
      </div>
    </el-dialog>
  </div>
</template>
<script>
import _ from 'lodash';
import MT from 'MT';
import moment from 'moment';
import { mapActions } from 'vuex';
import 'element-ui/lib/theme-chalk/index.css';
import { Message } from 'element-ui';

export default {
  name: 'Login',
  components: {},
  data() {
    let checkUserName = (rule, value, callback) => {
      if (!value) {
        callback(new Error('用户名不能为空'));
      }
      callback();
    };
    let checkPwd = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('密码不能为空'));
      }
      callback();
    };
    return {
      formRule: {
        username: '',
        captcha: '',
        password: ''
      },
      remember: true,
      loading: false,
      dialog: {
        title: '',
        visible: false
      },
      captcha: '/api/captcha?timeHear=1',
      rules: {
        username: [{ validator: checkUserName, trigger: 'blur' }],
        password: [{ validator: checkPwd, trigger: 'blur' }]
      }
    };
  },
  created() {
  },
  methods: {
    ...mapActions(['clearUserInfo', 'saveUserInfo']),
    async signIn(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true;
          MT.post('/sysUser/login', this.formRule, true).then(result => {
            this.loading = false;
            if (result.code === '0') {
              let data = result.data.obj;
              MT.clearSessionStorage();
              data.menus = this.handleMenus(data.menus);
              data.authorityList = this.handleAuthorityList(data.menus);
              // 保存用户数据
              MT.setSessionStorage('login_user_info', data);
              MT.loadElementTypeTime();
              this.saveUserInfo(data);
              MT.showMessage('登录成功', 'success', 1000, () => {
              });
              if (this.$router) {
                this.$router.push('/main');
                return;
              }
              location.href = '/main';
            } else {
              Message.error(result.msg);
              this.refreshImg();
            }
          });
        } else {
          return false;
        }
      });
    },
    // 处理权限菜单
    handleAuthorityList(menus) {
      let list = [];
      menus.forEach(item => {
        list.push(item.htmlUrl);
        let children = item.children;
        if (children && children.length > 0) {
          children.forEach(child => {
            list.push(child.htmlUrl);
          });
        }
      });
      return list;
    },
    handleMenus(menus) {
      _.remove(menus, item => {
        return !item.checked;
      });
      menus.forEach(item => {
        let children = item.children;
        if (children && children.length > 0) {
          _.remove(children, child => {
            return !child.checked;
          });
        }
      });
      return menus;
    },
    refreshImg() {
      this.captcha = '/api/captcha?timeHear=' + moment().millisecond();
    }
  }
};
</script>

<style lang="scss" scoped>
  .login-page-wrap {
    display: flex;
    width: 100%;
    min-width: 1024px;
    height: 100vh;
    min-height: 900px;
    align-items: center;
    overflow: hidden;
    /*background: url(../../../static/images/bg.png) no-repeat center;*/
    background-size: cover;
    .core-table {
      display: flex;
      width: 100%;
      height: 550px;
      box-sizing: border-box;
      margin: 0 auto;
      background-size: cover;
      .left-part {
        flex: 1;
      }
      .right-part {
        display: flex;
        flex: 1;
        height: 100%;
        justify-content: center;
        .right-inner {
          display: flex;
          width: 425px;
          height: 100%;
          flex-direction: column;
          align-items: center;
          background: #ffffff99;
          .el-form {
            width: 85%;
            .remember-form {
              padding-bottom: 40px;
              .forget {
                float: right;
                padding-right: 3px;
                color: #376fff;
                cursor: pointer;
                &:hover {
                  font-weight: bold;
                }
              }
            }
          }
        }
      }
    }
  }
</style>
