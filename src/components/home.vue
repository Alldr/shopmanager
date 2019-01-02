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
          <!-- 用户管理 -->
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>用户管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="1-1">
                <i class="el-icon-menu"></i>
                <span>用户列表</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <!-- 权限管理 -->
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>权限管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="2-1">
                <i class="el-icon-menu"></i>
                <span>角色列表</span>
              </el-menu-item>
              <el-menu-item index="2-2">
                <i class="el-icon-menu"></i>
                <span>权限列表</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <!-- 商品管理 -->
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>商品管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="3-1">
                <i class="el-icon-menu"></i>
                <span>商品列表</span>
              </el-menu-item>
              <el-menu-item index="3-2">
                <i class="el-icon-menu"></i>
                <span>分类参数</span>
              </el-menu-item>
              <el-menu-item index="3-3">
                <i class="el-icon-menu"></i>
                <span>商品分类</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <!-- 订单管理 -->
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>订单管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="4-1">
                <i class="el-icon-success"></i>
                <span>订单列表</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <!-- 数据统计 -->
          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>数据统计</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="5-1">
                <i class="el-icon-menu"></i>
                <span>数据列表</span>
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
  beforeCreate() {
    if (!localStorage.getItem("token")) {
      this.$message.warning("请先登录");
      this.$router.push({ path: "/login" });
    }
  },
  methods: {
    //退出登录
    handleLogout() {
      //清除token
      localStorage.clear();
      //重定位到登录页面
      this.$router.push({ path: "/login" });
      this.$message.success("退出成功");
    }
  }
};
</script>

<style>
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
</style>
