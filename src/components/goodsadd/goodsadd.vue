<template>
  <el-card>
    <!-- 面包屑导航 -->
    <BreadNav :navone="'商品管理'" :navtwo="'商品列表'"/>
    <!-- 消息提示 -->
    <el-alert class="myalert" title="添加商品信息" type="info" center show-icon></el-alert>
    <!-- 步骤条 -->
    <el-steps :active="active" class="mystep" finish-status="success" align-center>
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
    </el-steps>
    <!-- 标签页 -->
    <el-tabs class="tabs" tab-position="left" @tab-click="handleClick" value="first">
      <el-tab-pane label="基本信息" name="first">
        <!-- 基本信息 -->
        <el-form label-width="80px" :rules="rules" ref="ruleForm" label-position="top">
          <el-form-item prop="goods_name" label="商品名称">
            <el-input></el-input>
          </el-form-item>
          <el-form-item prop="goods_price" label="商品价格">
            <el-input></el-input>
          </el-form-item>
          <el-form-item prop="goods_weight" label="商品重量">
            <el-input></el-input>
          </el-form-item>
          <el-form-item prop="goods_number" label="商品数量">
            <el-input></el-input>
          </el-form-item>
          <el-form-item prop="goods_cate" label="商品分类">
            {{category}}
            <el-cascader v-model="category" :options="options" :props="props"></el-cascader>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="商品参数" name="second">
        <template slot-scope="scope">
          <div class="many" v-for="(item1,index1) in canlist" :key="index1">
            <h4>{{item1.attr_name}}</h4>
            <el-checkbox
              v-for="(val,index) in item1.attr_vals.split(',')"
              :key="index"
              v-model="checked"
              :label="val"
              border
            ></el-checkbox>
          </div>
        </template>
      </el-tab-pane>
      <el-tab-pane label="商品属性" name="third">
        <el-form label-width="80px" label-position="top">
          <el-form-item v-for="(item,index) in shulist" :key="index" :label="item.attr_name">
            <el-input v-model="item.attr_vals" placeholder="请输入内容"></el-input>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="商品图片" name="fourth">
        <!-- 上传图片
         :on-preview="handlePreview"
        :on-remove="handleRemove"-->
        <el-upload
          action="http://localhost:8888/api/private/v1/upload"
          :file-list="fileList"
          list-type="picture"
          multiple
          :headers="hearders"
          :on-success="handlePreview"
          :on-remove="handleRemove"
          :on-preview="preview"
        >
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </el-tab-pane>
      <el-tab-pane label="商品内容" name="fifth">
        <el-button type="success" plain>添加商品</el-button>
        <!-- 添加富文本框 -->
        <quill-editor></quill-editor>
      </el-tab-pane>
    </el-tabs>
    <!-- 图片预浏览 -->
    <el-dialog title="图片预浏览" :visible.sync="dialogImg" width="40%">
      <img ref="myimg" alt>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogImg = false">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
import BreadNav from "../home/layout/BreadNav/BreadNav.vue";
export default {
  data() {
    return {
      active: 0,
      ruleForm: {
        //用户信息
        goods_name: "",
        goods_price: "",
        goods_weight: "",
        goods_number: ""
      },
      //用户验证
      rules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" }
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" }
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" }
        ],
        goods_cate: [{ required: true, trigger: "blur" }]
      },
      options: [],
      props: {
        expandTrigger: 'hover' ,
        value: "cat_id",
        label: "cat_name"
      },
      category: [],
      canlist: [], //商品参数数据
      shulist: [], //商品属性数据
      checked: true,
      fileList: [], //上传图片数据
      dialogImg: false, //图片预浏览的状态
      hearders: {
        Authorization: localStorage.getItem("token")
      }
    };
  },
  methods: {
    //获取标签页点击数据
    handleClick(tab, event) {
      //根据标签页改变步骤栏的信息
      this.active = +tab.index;
      if (tab.index == 1 || tab.index == 2) {
        if (this.category.length == 0) {
          this.$message.error("请选择商品分类");
          return;
        }
      }
      this.getGoodsList(tab.index);
    },
    //封装一个获取商品参数
    async getGoodsList(tag) {
      //商品分类的参数id
      let id = this.category[this.category.length - 1];
      //判断传参的条件
      let sel = tag === "1" ? "many" : "only";
      let res = await this.$http.get(`categories/${id}/attributes?sel=${sel}`);
      //解构
      let { meta, data } = res.data;
      if (meta.status == 200) {
        if (sel == "many") {
          this.canlist = data;
        } else {
          this.shulist = data;
        }
      }
    },
    //获取联级框的数据
    async getStepList() {
      let res = await this.$http.get("categories?type=3");
      //解构
      let { meta, data } = res.data;
      if (meta.status == 200) {
        this.options = data;
      } else {
        this.$message.error(meta.msg);
      }
    },
    //上传图片
    handlePreview(res, file) {
      //将上传的图片保存的fileList
      this.fileList.push({ name: file.name, url: file.url });
    },
    //移出图片
    handleRemove(file, fileList) {
      for (var i = 0; i < this.fileList.length; i++) {
        if (this.fileList[i].url === file.url) {
          this.fileList.splice(i, 1);
        }
      }
    },
    //图片预浏览
    preview(file) {
      this.dialogImg = true;
      this.$nextTick(function() {
        //在数据下次更新时打开
        this.$refs.myimg.src = file.url;
      });
    }
  },
  mounted() {
    this.getStepList();
  },
  components: {
    BreadNav
  }
};
</script>

<style lang="scss">
$height: 20px;
.myalert,
.mystep,
.tabs {
  margin-top: $height;
}
.el-step__title {
  font-size: 14px;
}
.many {
  h4 {
    font-weight: normal;
    font-size: 14px;
  }
}
.ql-editor {
  height: 500px;
}

</style>
