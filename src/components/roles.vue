<template>
  <el-card class="card">
    <!-- 面包屑 -->
    <my-bread level1="权限管理" level2="角色列表"></my-bread>
    <!-- 添加按钮 -->
    <el-row class="row">
      <el-col>
        <el-button type="primary" plain>添加角色</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table :data="roles" style="width: 100%">
      <el-table-column type="expand" width="80">
        <template slot-scope="rights">
          <el-row v-for="(item1,i) in rights.row.children" :key="i">
            <el-col :span="4">
              <el-tag @close="delRights(rights.row,item1)" closable>{{item1.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="20">
              <el-row v-for="(item2,i) in item1.children" :key="i">
                <el-col :span="4">
                  <el-tag
                    @close="delRights(rights.row,item2)"
                    closable
                    type="success"
                  >{{item2.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="20">
                  <el-tag
                    @close="delRights(rights.row,v)"
                    closable
                    v-for="(v,i) in item2.children"
                    :key="i"
                    type="warning"
                  >{{v.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row v-if="rights.row.children.length === 0">
            <el-col>
              <span>该角色未分配任何权限</span>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" label="#" width="180"></el-table-column>
      <el-table-column label="角色名称" prop="roleName" width="220"></el-table-column>
      <el-table-column label="角色描述" prop="roleDesc" width="260"></el-table-column>
      <el-table-column label="操作" width="260">
        <template slot-scope="scope">
          <el-button size="mini" plain type="primary" icon="el-icon-edit" circle></el-button>
          <el-button size="mini" plain type="danger" icon="el-icon-delete" circle></el-button>
          <el-button
            size="mini"
            @click="showDia(scope.row)"
            plain
            type="success"
            icon="el-icon-check"
            circle
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分配对话框 -->
    <el-dialog title="分配权限" :visible.sync="dialogVisible" width="50%">
      <!-- 树形结构 -->
      <el-tree
        ref="tree"
        default-expand-all
        :data="treeData"
        show-checkbox
        node-key="id"
        :props="defaultProps"
        :default-checked-keys="checkedArr"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRights()">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      roles: [],
      dialogVisible: false,
      treeData: [],
      defaultProps: {
        children: "children",
        label: "authName"
      },
      checkedArr: [],
      currRoleId: -1
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    //分配权限
    async setRights() {
      const CheckedKeys = this.$refs.tree.getCheckedKeys();
      const HalfCheckedKeys = this.$refs.tree.getHalfCheckedKeys();
      const arr = [...CheckedKeys, ...HalfCheckedKeys];
      const res = await this.$http.post(`roles/${this.currRoleId}/rights`, {
        rids: arr.join(",")
      });
      const {
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        this.dialogVisible = false;
        this.$message.success(msg);
        this.getRolesList();
      }
    },
    //显示分配对话框
    async showDia(role) {
      this.currRoleId = role.id;
      const res = await this.$http.get(`rights/tree`);
      this.treeData = res.data.data;
      const arr = [];
      role.children.forEach(item => {
        item.children.forEach(item => {
          item.children.forEach(item => {
            arr.push(item.id);
          });
        });
      });
      this.checkedArr = arr;
      this.dialogVisible = true;
    },
    //删除权限
    async delRights(role, rights) {
      const res = await this.$http.delete(
        `roles/${role.id}/rights/${rights.id}`
      );
      const {
        data,
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        this.$message.success(msg);
        role.children = data;
      }
    },
    async getRolesList() {
      const res = await this.$http.get(`roles`);
      const {
        data,
        meta: { status }
      } = res.data;
      if (status === 200) {
        this.roles = data;
      }
    }
  }
};
</script>

<style>
.card {
  height: 100%;
}
.row {
  margin-top: 20px;
}
.el-tag {
  margin-right: 5px;
  margin-bottom: 5px;
}
.el-dialog__body {
  height: 400px;
  overflow: auto;
}
</style>
