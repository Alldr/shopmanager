<template>
  <el-card class="card">
    <!-- 面包屑 -->
    <my-bread level1="权限管理" level2="权限列表"></my-bread>
    <!-- 表格 -->
    <el-table :data="rightsList" v-loading="loading" height="550" border style="width: 100%" class="table">
      <el-table-column type="index" label="#" width="120"></el-table-column>
      <el-table-column prop="authName" label="权限名称" width="220"></el-table-column>
      <el-table-column prop="path" label="路径" width="220"></el-table-column>
      <!-- 显示层级 -->
      <el-table-column label="层级">
        <template slot-scope="scope">
          <span v-if="scope.row.level === '0'">一级</span>
          <span v-if="scope.row.level === '1'">二级</span>
          <span v-if="scope.row.level === '2'">三级</span>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      rightsList: [],
      loading: false
    };
  },
  created() {
    this.getRightsList();
  },
  methods: {
    async getRightsList() {
      this.loading = true;
      const res = await this.$http.get(`rights/list`);
      const {
        data,
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        this.loading = false;
        this.rightsList = data;
        this.$message.success(msg);
      }
    }
  }
};
</script>

<style scoped>
.card {
  height: 100%;
}
.table {
  margin-top: 20px;
}
</style>
