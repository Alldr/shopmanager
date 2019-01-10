<template>
  <el-card class="card">
    <!-- 面包屑 -->
    <my-bread level1="商品管理" level2="商品列表"></my-bread>
    <!-- 提示 -->
    <el-row class="row">
      <el-col>
        <el-alert title="添加商品信息" type="info" :closable="false" center show-icon></el-alert>
      </el-col>
    </el-row>
    <!-- 步骤条 -->
    <el-steps :active="active-0" align-center>
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
    </el-steps>
    <!-- 数据需要表单提交 -->
    <el-form label-position="top" :model="form">
      <!-- 标签页 -->
      <el-tabs tab-position="left" v-model="active" @tab-click="changeTab()">
        <el-tab-pane label="基本信息" name="1">
          <el-form-item label="商品名称">
            <el-input v-model="form.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="form.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="form.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="form.goods_number"></el-input>
          </el-form-item>
          <!-- 级联选择器 -->
          <el-form-item label="商品分类">
            <el-cascader
              expand-trigger="hover"
              clearable
              :options="options"
              v-model="selectedOptions"
              :props="defaultProps"
              @change="handleChange"
            ></el-cascader>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品参数" name="2">
          <el-form-item v-for="(item,i) in manyData" :key="i" :label="item.attr_name">
            <el-checkbox-group :min="1" v-model="item.attr_vals">
              <el-checkbox v-for="(v,i) in item.attr_vals" :key="i" border :label="v"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品属性" name="3">
          <el-form-item :label="item.attr_name" v-for="(item,i) in onlyData" :key="i">
            <el-input v-model="item.attr_vals" placeholder="请输入内容"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品图片" name="4">
          <el-form-item>
            <el-upload
              class="upload-demo"
              action="http://localhost:8888/api/private/v1/upload"
              :on-success="handleSuccess"
              :on-remove="handleRemove"
              :headers="headers"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品内容" name="5">
          <el-form-item>
            <el-button size="small" type="primary" @click="addGoods()">添加商品</el-button>
            <quill-editor></quill-editor>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </el-card>
</template>

<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import { quillEditor } from "vue-quill-editor";

export default {
  components: {
    quillEditor
  },
  data() {
    return {
      active: 0,
      form: {
        goods_name: "",
        goods_price: "",
        goods_number: "",
        goods_weight: "",
        goods_introduce: "",
        goods_cat: "",
        pics: [],

        attrs: []
      },
      defaultProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children"
      },
      options: [],
      selectedOptions: [1, 3, 6],
      manyData: [],
      onlyData: [],
      headers: {
        Authorization: localStorage.getItem("token")
      }
    };
  },
  methods: {
    //添加商品
    async addGoods() {
      this.form.goods_cat = this.selectedOptions.join(",");
      const activeData = this.manyData;
      const staticData = this.onlyData;
      const activeArr = activeData.map(item => {
        return { attr_id: item.attr_id, attr_value: item.attr_vals };
      });
      const staticArr = staticData.map(item => {
        return { attr_id: item.attr_id, attr_value: item.attr_vals };
      });
      this.form.attrs = [...activeArr, ...staticArr];
      const res = await this.$http.post(`goods`, this.form);
      const {
        meta: { msg, status }
      } = res.data;
      if (status === 201) {
        this.$router.push({
          name: "goods"
        });
        this.$message.success(msg);
      }
    }, //上传图片移除时触发
    handleRemove(file) {
      const index = this.form.pics.findIndex(item => {
        return item.pic === file.response.data.tmp_path;
      });
      this.form.pics.splice(index, 1);
    },
    //上传图片成功时触发
    handleSuccess(response) {
      this.form.pics.push({
        pic: response.data.tmp_path
      });
    },

    //tab栏发生变化时 触发
    async changeTab() {
      //判断是否是第二栏
      if (this.active === "2") {
        //判断是否有三级分类
        if (this.selectedOptions.length === 3) {
          const res = await this.$http.get(
            `categories/${this.selectedOptions[2]}/attributes?sel=many`
          );
          this.manyData = res.data.data;
          this.manyData.forEach(item => {
            item.attr_vals =
              item.attr_vals.trim().length === 0
                ? []
                : item.attr_vals.trim().split(",");
          });
        } else {
          this.$message.warning("请选择商品的三级分类");
        }
      }
      //判断是否是第三栏
      if (this.active === "3") {
        //判断是否有三级分类
        if (this.selectedOptions.length === 3) {
          const res = await this.$http.get(
            `categories/${this.selectedOptions[2]}/attributes?sel=only`
          );
          this.onlyData = res.data.data;
        } else {
          this.$message.warning("请选择商品的三级分类");
        }
      }
    },
    //获取商品数据列表
    async getGoodsCate() {
      const res = await this.$http.get(`categories`);
      this.options = res.data.data;
    },
    //绑定的值变化时 触发
    handleChange(value) {}
  },
  created() {
    this.getGoodsCate();
  }
};
</script>

<style scoped>
.card {
  height: 100%;
}
.row {
  margin: 20px 0;
}
.el-tab-pane {
  height: 400px;
  overflow: auto;
}
.ql-container {
  height: 200px;
}
</style>
