<template>
  <el-card class="card">
    <!-- 面包屑 -->
    <my-bread level1="数据统计" level2="数据报表"></my-bread>
    <!-- 图表 -->
    <div id="main" v-loading="loading" style="width: 800px;height:500px;"></div>
  </el-card>
</template>

<script>
import echarts from "echarts";

export default {
  data() {
    return {
      loading: false
    };
  },
  mounted() {
    this.insertChart();
  },
  methods: {
    async insertChart() {
      // 基于准备好的dom，初始化echarts实例
      const myChart = echarts.init(document.getElementById("main"));
      //获取后端数据
      this.loading = true;
      const res = await this.$http.get(`reports/type/1`);
      this.loading = false;
      const option1 = res.data.data;
      const option2 = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985"
            }
          }
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: "8%",
          right: "1%",
          top: "10%",
          bottom: "2%",
          containLabel: true
        }
      };
      const option = { ...option1, ...option2 };
      // 绘制图表
      myChart.setOption(option);
    }
  }
};
</script>

<style scoped>
.card {
  height: 100%;
}
#main {
  margin: 40px auto;
}
</style>
