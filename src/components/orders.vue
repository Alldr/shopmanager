<template>
  <el-card class="card">
    <!-- 面包屑 -->
    <my-bread level1="订单管理" level2="订单列表"></my-bread>
    <!-- 表格 -->
    <el-table :data="tableData" class="table" v-loading="loading" border style="width: 100%" height="450" stripe>
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column prop="order_number" label="订单编号" width="180"></el-table-column>
      <el-table-column prop="order_price" label="订单价格"></el-table-column>
      <el-table-column label="是否付款">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.pay_status === 0" type="danger">未付款</el-tag>
          <el-tag v-else type="danger">已付款</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="是否发货">
        <template slot-scope="scope">
          <span>{{scope.row.is_send}}</span>
        </template>
      </el-table-column>
      <el-table-column label="下单时间">
        <template slot-scope="scope">{{scope.row.create_time | fmtDate}}</template>
      </el-table-column>
      <el-table-column label="操作" width="80">
        <template slot-scope="scope">
          <el-button
            type="primary"
            @click="showDia(scope.row)"
            plain
            size="small"
            icon="el-icon-edit"
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
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- 对话框 -->
    <el-dialog title="修改订单地址" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="省市区" :label-width="formLabelWidth">
          <!-- 级联选择器 -->
          <el-cascader
            placeholder="请选择"
            clearable
            v-model="selectedOptions"
            expand-trigger="hover"
            :options="options"
            filterable
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import options from '@/assets/city_data_element.js'
export default {
  data() {
    return {
      loading: false,
      tableData: [],
      pagenum: 1,
      pagesize: 5,
      total: -1,
      dialogFormVisible: false,
      formLabelWidth: "100px",
      form: {},
      options,
      selectedOptions: []
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    // 点击按钮显示对话框
    showDia() {
      this.selectedOptions = [];
      this.dialogFormVisible = true;
    },
    //获取订单列表
    async getTableData() {
      this.loading = true;
      const res = await this.$http.get(
        `orders?query=${this.query}&pagesize=${this.pagesize}&pagenum=${
          this.pagenum
        }`
      );
      this.loading = false;
      this.tableData = res.data.data.goods;
      this.total = res.data.data.total;
      this.pagenum = res.data.data.pagenum - 0;
    },
    //分页改变
    handleSizeChange(val) {
      this.pagenum = 1;
      this.pagesize = val;
      this.getTableData();
    },
    //当前页码改变
    handleCurrentChange(val) {
      this.pagenum = val;
      this.getTableData();
    }
  }
};
</script>

<style scoped>
.card {
  height: 100%;
}
.table {
  margin: 20px 0;
}
</style>
