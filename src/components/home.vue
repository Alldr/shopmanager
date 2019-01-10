<template>
  <el-container class="container">
    <!-- 头部 -->
    <el-header class="header">
      <el-row>
        <el-col :span="3">
          <div class="grid-content bg-purple">
            <img src="@/assets/logo.png" alt="图片无法显示">
          </div>
        </el-col>
        <el-col :span="19" class="middle">
          <h2>电商后台管理系统</h2>
        </el-col>
        <el-col :span="1" class="logout">
          <a href="#" @click.prevent="handleLogout()">退出</a>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px" class="aside">
        <el-menu
          default-active="2"
          unique-opened
          router
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
        >
          <el-submenu v-for="(item,i) in menusData" :key="i" :index="'' + item.order">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item-group v-for="(v,i) in item.children" :key="i">
              <el-menu-item :index="v.path">
                <i class="el-icon-menu"></i>
                <span>{{v.authName}}</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 内容 -->
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menusData: []
    };
  },
  created() {
    this.getMenus();
  },
  methods: {
    handleOpen(key, keyPath) {},
    handleClose(key, keyPath) {},
    //退出登录
    handleLogout() {
      //清除token
      localStorage.clear();
      //重定位到登录页面
      this.$router.push({ path: "/login" });
      this.$message.success("退出成功");
    },
    async getMenus() {
      const res = await this.$http.get(`menus`);
      const {
        data,
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        this.menusData = data;
      }
    }
  }
};
</script>

<style scoped>
.container {
  height: 100%;
}
.container .header {
  background-color: #b3c0d1;
}
.middle {
  text-align: center;
  color: white;
  line-height: 60px;
}
.logout {
  line-height: 60px;
}
.main {
  background-color: #e7eef7;
}
</style>
