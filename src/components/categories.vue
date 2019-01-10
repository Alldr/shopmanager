<template>
  <el-card class="card">
    <!-- 面包屑 -->
    <my-bread level1="商品管理" level2="商品分类"></my-bread>
    <!-- 按钮 -->
    <el-button type="primary" class="btn" plain @click="showAddCate()">添加分类</el-button>
    <!-- 表格 -->
    <el-table :data="goodsData" v-loading="loading" height="500" style="width: 100%" class="table">
      <el-tree-grid
        file-icon="icon icon-file"
        folder-icon="icon icon-folder"
        prop="cat_name"
        width="180"
        label="分类名称"
        treeKey="cat_id"
        parentKey="cat_pid"
        levelKey="cat_level"
        childKey="children"
      ></el-tree-grid>
      <el-table-column label="级别" width="180">
        <template slot-scope="scope">
          <span v-if="scope.row.cat_level ===0">一级</span>
          <span v-else-if="scope.row.cat_level ===1">二级</span>
          <span v-else-if="scope.row.cat_level ===2">三级</span>
        </template>
      </el-table-column>
      <el-table-column prop="goods_weight" label="是否有效" width="180">
        <template slot-scope="scope">
          <span v-if="scope.row.cat_deleted === false">有效</span>
          <span v-else-if="scope.row.cat_deleted === ture"></span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" plain icon="el-icon-edit" circle></el-button>
          <el-button
            type="primary"
            size="mini"
            plain
            icon="el-icon-delete"
            @click="delGoods(scope.row)"
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
      :page-sizes="[5, 10, 15, 20]"
      :page-size="5"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- 添加分类 -->
    <el-dialog title="添加分类" :visible.sync="dialogFormVisibleRole">
      <el-form :model="form" label-position="left">
        <el-form-item label="分类名称" :label-width="formLabelWidth">
          <el-input v-model="form.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="分类" :label-width="formLabelWidth">
          <!-- 级联选择器 -->
          <el-cascader
            expand-trigger="hover"
            clearable
            change-on-select
            :options="options"
            v-model="selectedOptions"
            :props="defaultProps"
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleRole = false">取 消</el-button>
        <el-button type="primary" @click="addCate()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import ElTreeGrid from "element-tree-grid";

export default {
  components: {
    ElTreeGrid
  },
  data() {
    return {
      loading: false,
      goodsData: [],
      pagenum: 1,
      pagesize: 10,
      total: -1,
      options: [],
      selectedOptions: [],
      dialogFormVisibleRole: false,
      form: {
        cat_name: "",
        cat_pid: -1,
        cat_level: -1
      },
      defaultProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children"
      },
      formLabelWidth: "100px"
    };
  },
  created() {
    this.getGoodsCate();
  },
  methods: {
    //添加分类
    async addCate() {
      //判断添加几级分类
      if (this.selectedOptions.length === 0) {
        this.form.cat_pid = 0;
        this.form.cat_level = 0;
      }
      if (this.selectedOptions.length === 1) {
        this.form.cat_pid = this.selectedOptions[0];
        this.form.cat_level = 1;
      }
      if (this.selectedOptions.length === 2) {
        this.form.cat_pid = this.selectedOptions[1];
        this.form.cat_level = 2;
      }
      const res = await this.$http.post(`categories`, this.form);
      const {
        meta: { msg, status }
      } = res.data;
      if (status === 201) {
        this.$message.success(msg);
        //刷新页面
        this.getGoodsCate();
        //关闭对话框
        this.dialogFormVisibleRole = false;
      }
    },
    //绑定值变化时触发
    handleChange() {},
    //点击按钮 显示添加分类对话框
    showAddCate() {
      //显示对话框
      this.dialogFormVisibleRole = true;
      //获取分类列表
      this.getCate();
      //清空
      this.selectedOptions = [];
      this.cat_name = "";
    },
    //获取分类列表
    async getCate() {
      const res = await this.$http.get(`categories?type=2`);
      this.options = res.data.data;
    },
    //获取商品列表
    async getGoodsCate() {
      this.loading = true;
      const res = await this.$http.get(
        `categories?query=${this.query}&pagesize=${this.pagesize}&pagenum=${
          this.pagenum
        }`
      );
      const {
        data: { total, result },
        meta: { status, msg }
      } = res.data;
      this.loading = false;
      this.goodsData = result;
      this.total = total;
    },
    //页面条数改变时触发
    handleSizeChange(val) {
      this.pagenum = 1;
      this.pagesize = val;
      this.getGoodsCate();
    },
    //当前页数改变时触发
    handleCurrentChange(val) {
      this.pagenum = val;
      this.getGoodsCate();
    }
  }
};
</script>

<style scoped>
.btn {
  margin-top: 20px;
}
</style>
