<template>
  <el-card class="card">
    <!-- 面包屑 -->
    <my-bread level1="商品管理" level2="商品列表"></my-bread>
    <!-- 搜索栏 -->
    <el-row>
      <el-col>
        <el-input
          placeholder="请输入用户名"
          clearable
          @clear="getAllGoods()"
          v-model="query"
          class="input-with-select"
        >
          <el-button slot="append" @click="searchGoods()" icon="el-icon-search"></el-button>
        </el-input>
        <el-button type="primary" @click="$router.push({name: 'goodsAdd'})" plain>添加商品</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table :data="goodsData" border height="500" style="width: 100%" class="table">
      <el-table-column type="index" label="#" width="80"></el-table-column>
      <el-table-column prop="goods_name" label="商品名称"></el-table-column>
      <el-table-column prop="goods_price" label="商品价格(元)" width="80"></el-table-column>
      <el-table-column prop="goods_weight" label="商品重量" width="80"></el-table-column>
      <el-table-column label="创建日期" width="120">
        <template slot-scope="scope">{{scope.row.add_time |fmtDate}}</template>
      </el-table-column>
      <el-table-column label="操作" width="120">
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
      :page-sizes="[20, 40, 60, 80]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      query: "",
      goodsData: [],
      pagenum: 1,
      pagesize: 20,
      total: -1,
      form: {
        goods_name: "",
        goods_cat: "",
        goods_price: "",
        goods_number: "",
        goods_weight: "",
        goods_introduce: "",
        pics: "",
        attrs: ""
      },
      formLabelWidth: "100px",
      dialogFormVisibleAdd: false
    };
  },
  created() {
    this.getGoodsData();
  },
  methods: {
    //删除商品
    async delGoods(goods) {
      const res = await this.$http.delete(`goods/${goods.goods_id}`);
      const {
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        this.$message.success(msg);
        this.pagenum = 1;
        this.getGoodsData();
      }
    },
    //清除搜索框时 显示所有商品信息
    getAllGoods() {
      this.getGoodsData();
    },
    //搜索商品
    searchGoods() {
      this.pagenum = 1;
      this.getGoodsData();
    },
    //获取商品数据
    async getGoodsData() {
      const res = await this.$http.get(
        `goods?query=${this.query}&pagenum=${this.pagenum}&pagesize=${
          this.pagesize
        }`
      );
      const {
        data,
        meta: { status }
      } = res.data;
      if (status === 200) {
        this.goodsData = data.goods;
        this.total = data.total;
      }
    },
    //页面条数改变时触发
    handleSizeChange(val) {
      this.pagenum = 1;
      this.pagesize = val;
      this.getGoodsData();
    },
    //当前页数改变时触发
    handleCurrentChange(val) {
      this.pagenum = val;
      this.getGoodsData();
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
.table {
  margin-top: 20px;
  margin-bottom: 5px;
}
.form {
  padding: 0 20px;
}
</style>
