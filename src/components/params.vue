<template>
  <el-card class="card">
    <!-- 面包屑 -->
    <my-bread level1="商品管理" level2="分类参数"></my-bread>
    <!-- 提示 -->
    <el-row class="row">
      <el-col>
        <el-alert title="注意:只允许为三级分类设置参数" type="warning" :closable="false" left show-icon></el-alert>
      </el-col>
    </el-row>
    <!-- 级联选择器 -->
    <el-form label-position="left" :model="form">
      <el-form-item label="请选择商品分类">
        <el-cascader
          expand-trigger="hover"
          clearable
          :options="options"
          v-model="selectedOptions"
          :props="defaultProps"
          :show-all-levels="false"
          @change="handleChange"
        ></el-cascader>
      </el-form-item>
    </el-form>
    <!-- 标签页tabs -->
    <el-tabs type="border-card" tabPosition="top" v-model="active" @tab-click="changeTab()">
      <el-tab-pane name="1" label="动态参数">
        <!-- 按钮 -->
        <el-button type="primary" :disabled="selectedOptions.length === 0" plain>设置动态参数</el-button>
        <!-- 表格 -->
        <el-table :data="manyData" height="300" style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="scope">
              <!-- 标签tag -->
              <el-tag
                :key="i"
                v-for="(tag,i) in scope.row.attr_vals"
                closable
                :disable-transitions="false"
                @close="handleClose(scope.row,tag)"
              >{{tag}}</el-tag>
              <el-input
                class="input-new-tag"
                v-if="inputVisible"
                v-model="inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(scope.row)"
                @blur="handleInputConfirm(scope.row)"
              ></el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
            </template>
          </el-table-column>
          <el-table-column label="#" type="index"></el-table-column>
          <el-table-column label="属性名称" prop="attr_name"></el-table-column>
          <el-table-column label="操作">
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
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane name="2" label="静态参数">
        <!-- 按钮 -->
        <el-button type="primary" :disabled="selectedOptions.length === 0" plain>设置静态参数</el-button>
        <!-- 表格 -->
        <el-table :data="onlyData" height="300" style="width: 100%">
          <el-table-column label="#" type="index"></el-table-column>
          <el-table-column label="属性名称" prop="attr_name"></el-table-column>
          <el-table-column label="属性值" prop="attr_vals"></el-table-column>
          <el-table-column label="操作">
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
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      active: "1",
      form: {},
      options: [],
      selectedOptions: [],
      defaultProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children"
      },
      manyData: [],
      onlyData: [],
      dynamicTags: [],
      inputVisible: false,
      inputValue: ""
    };
  },
  created() {
    this.getParamsData();
  },
  methods: {
    //修改参数
    async handleInputConfirm(attr) {
      let inputValue = this.inputValue;
      if (inputValue) {
        attr.attr_vals.push(inputValue);
      }
      //编辑参数
      const putData = {
        attr_name: attr.attr_name,
        attr_sel: attr.attr_sel,
        attr_vals: attr.attr_vals.join(",")
      };
      const res = await this.$http.put(
        `categories/${this.selectedOptions[2]}/attributes/${attr.attr_id}`,
        putData
      );
      const msg = res.data.meta.msg;
      this.$message.success(msg);
      this.getManyData();
      this.inputVisible = false;
      this.inputValue = "";
    },
    //显示添加动态参数的tag文本框
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    //关闭tag标签时触发
    async handleClose(attr, tag) {
      attr.attr_vals.splice(attr.attr_vals.indexOf(tag), 1);
      const putData = {
        attr_name: attr.attr_name,
        attr_sel: attr.attr_sel,
        attr_vals: attr.attr_vals.join(",")
      };
      const res = await this.$http.put(
        `categories/${this.selectedOptions[2]}/attributes/${attr.attr_id}`,
        putData
      );
      const msg = res.data.meta.msg;
      this.$message.success(msg);
      this.getManyData();
    },
    //改变标签页时触发
    changeTab() {
      if (this.selectedOptions.length === 3 && this.active === "1") {
        this.getManyData();
      }
      //判断是否有三级分类 并且为静态参数
      if (this.selectedOptions.length === 3 && this.active === "2") {
        this.getOnlyData();
      }
    },

    //改变分类时触发
    handleChange() {
      //判断是否有三级分类并且为动态参数
      if (this.selectedOptions.length === 3 && this.active === "1") {
        this.getManyData();
      }
    },
    //获取动态参数请求
    async getManyData() {
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
    },
    //获取分类数据
    async getParamsData() {
      const res = await this.$http.get(`categories`);
      this.options = res.data.data;
    },
    //获取静态参数
    async getOnlyData() {
      const res = await this.$http.get(
        `categories/${this.selectedOptions[2]}/attributes?sel=only`
      );
      this.onlyData = res.data.data;
    }
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
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
