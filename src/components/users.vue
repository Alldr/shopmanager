<template>
  <el-card class="card">
    <!-- 面包屑 -->
    <my-bread level1="用户列表" level2="用户详情"></my-bread>
    <!-- 搜索栏 -->
    <el-row>
      <el-col>
        <el-input
          placeholder="请输入用户名"
          clearable
          @clear="getAllUsers()"
          v-model="query"
          class="input-with-select"
        >
          <el-button slot="append" @click="searchUser()" icon="el-icon-search"></el-button>
        </el-input>
        <el-button type="primary" @click="showDialog()" plain>添加用户</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table :data="tableData" style="width: 100%" height="300">
      <el-table-column prop="id" label="#" width="80"></el-table-column>
      <el-table-column prop="username" label="姓名" width="100"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话" width="120"></el-table-column>
      <el-table-column label="创建日期" width="180">
        <template slot-scope="scope">{{scope.row.create_time | fmtDate}}</template>
      </el-table-column>
      <el-table-column label="用户状态" width="140">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            @change="changeStatus(scope.row)"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button
            @click="showUser(scope.row)"
            size="mini"
            plain
            type="primary"
            icon="el-icon-edit"
            circle
          ></el-button>
          <el-button
            @click="delUser(scope.row)"
            size="mini"
            plain
            type="danger"
            icon="el-icon-delete"
            circle
          ></el-button>
          <el-button
            @click="showRole(scope.row)"
            size="mini"
            plain
            type="success"
            icon="el-icon-check"
            circle
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="2"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- 对话框添加 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd">
      <el-form :model="form">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="addUser()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 对话框编辑 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleEdit">
      <el-form :model="form">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input disabled v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="editUser()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分配角色 -->
    <el-dialog title="分配角色" :visible.sync="dialogFormVisibleRole">
      <el-form>
        <el-form-item label="用户名" :label-width="formLabelWidth">{{currUsername}}</el-form-item>
        <el-form-item label="角色" :label-width="formLabelWidth">
          <el-select v-model="currRoleId" placeholder="请选择活动区域">
            <el-option disabled label="请选择" :value="-1"></el-option>
            <el-option v-for="(v,i) in roles" :key="i" :label="v.roleName" :value="v.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleRole = false">取 消</el-button>
        <el-button type="primary" @click="editRole()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      query: "",
      pagenum: 1,
      pagesize: 2,
      total: -1,
      dialogFormVisibleAdd: false,
      dialogFormVisibleEdit: false,
      dialogFormVisibleRole: false,
      form: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      formLabelWidth: "100px",
      currRoleId: "-1",
      roles: [],
      currUsername: "",
      currUserId: ""
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    //修改用户角色
    async editRole() {
      const res = await this.$http.put(`users/${this.currUserId}/role`, {
        rid: this.currRoleId
      });
      const { msg, status } = res.data.meta;
      if (status === 200) {
        this.$message.success(msg);
        this.dialogFormVisibleRole = false;
      }
    },
    //显示分配对话框
    async showRole(user) {
      this.currUsername = user.username;
      this.currUserId = user.id;
      this.dialogFormVisibleRole = true;
      //显示用户数据
      const resData = await this.$http.get(`roles`);
      const {
        meta: { status },
        data
      } = resData.data;
      if (status === 200) {
        this.roles = data;
      }
      //显示用户角色
      const resId = await this.$http.get(`users/${user.id}`);
      if (resId.data.meta.status === 200) {
        this.currRoleId = resId.data.data.rid;
      }
    },
    //修改用户状态
    async changeStatus(user) {
      const res = await this.$http.put(
        `users/${user.id}/state/${user.mg_state}`
      );
      const {
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        this.$message.success(msg);
      }
    },
    //编辑用户信息
    async editUser() {
      const res = await this.$http.put(`users/${this.form.id}`, this.form);
      const {
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        this.dialogFormVisibleEdit = false;
        this.$message.success(msg);
        this.getTableData();
      } else {
        this.$message.warning(msg);
      }
    },
    //显示编辑用户表单
    async showUser(user) {
      this.dialogFormVisibleEdit = true;
      const res = await this.$http.get(`users/${user.id}`);
      const {
        data,
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        this.form = data;
      }
    },
    //删除用户信息
    delUser(user) {
      this.$confirm("此操作将永久删除该用户信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await this.$http.delete(`users/${user.id}`);
          const {
            meta: { msg, status }
          } = res.data;
          this.$message.success(msg);
          this.pagenum = 1;
          this.getTableData();
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
    //添加用户信息
    async addUser() {
      const res = await this.$http.post("users", this.form);
      const {
        data,
        meta: { msg, status }
      } = res.data;
      if (status === 201) {
        this.dialogFormVisibleAdd = false;
        this.$message.success(msg);
        this.pagenum = 1;
        this.getTableData();
      } else {
        this.$message.warning(msg);
      }
    },
    //显示添加用户表单
    showDialog() {
      this.form = {};
      this.dialogFormVisibleAdd = true;
    },
    //点击清除文本框时 显示所有用户信息
    getAllUsers() {
      this.getTableData();
    },
    //搜索用户
    searchUser() {
      this.pagenum = 1;
      this.getTableData();
    },
    //页面条数改变时触发
    handleSizeChange(val) {
      this.pagenum = 1;
      this.pagesize = val;
      this.getTableData();
    },
    //当前页数改变时触发
    handleCurrentChange(val) {
      this.pagenum = val;
      this.getTableData();
    },
    //获取表格数据
    async getTableData() {
      const res = await this.$http.get(
        `users?query=${this.query}&pagesize=${this.pagesize}&pagenum=${
          this.pagenum
        }`
      );
      const {
        data: { total, users },
        meta: { status, msg }
      } = res.data;
      if (status === 200) {
        this.tableData = users;
        this.total = total;
      } else {
        this.$message.warning(msg);
      }
    }
  }
};
</script>

<style>
.card {
  height: 100%;
}
.input-with-select {
  margin-top: 20px;
  width: 350px;
}
</style>
