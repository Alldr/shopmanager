<template>
  <div class="wrap">
    <el-form :label-position="labelPosition" label-width="80px" :model="formData" class="form">
      <h2>用户登录</h2>
      <el-form-item label="用户名">
        <el-input v-model="formData.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="formData.password"></el-input>
      </el-form-item>
      <el-button type="primary" round class="btn" @click="handleLogin">登录</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      labelPosition: "top",
      formData: {
        username: "",
        password: ""
      }
    };
  },
  methods: {
    async handleLogin() {
      const res = await this.$http.post("login", this.formData);
      const {
        data: {
          meta: { msg, status },
          data
        }
      } = res;
      if (status === 200) {
        localStorage.setItem("token", data.token);
        this.$router.push({
          name: "home"
        });
        this.$message.success(msg);
      } else {
        this.$message.error(msg);
      }
    }
  }
};
</script>
<style scoped>
.wrap {
  height: 100%;
  background-color: #324152;
  display: flex;
  justify-content: center;
  align-items: center;
}
.wrap .form {
  width: 400px;
  border-radius: 4px;
  padding: 30px;
  background-color: #ffff;
}
.wrap .form .btn {
  width: 100%;
}
</style>
