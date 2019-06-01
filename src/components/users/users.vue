<template>
  <el-card>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
    <el-row class="myrow">
      <el-col :span="8">
        <el-input placeholder="请输入内容" v-model="search" class="input-with-select">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </el-col>
      <el-col :span="16">
        &nbsp;
        <el-button type="success" plain @click="add">添加用户</el-button>
      </el-col>
    </el-row>
    <!-- 用户数据表单 -->
    <el-table :data="tableData" :border="true" style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <!-- {{scope.row}} -->
          <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" plain></el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete" plain></el-button>
          <el-button type="success" size="mini" icon="el-icon-check" plain></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增用户弹框 -->
    <el-dialog title="新增用户" :visible.sync="AddForm">
      <el-form :model="formTable" :rules="rules" ref="ruleForm">
        <el-form-item label="用户名" prop="username" :label-width="formLabelWidth">
          <el-input v-model="formTable.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" :label-width="formLabelWidth">
          <el-input v-model="formTable.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="formTable.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="formTable.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="AddForm=false">取 消</el-button>
        <el-button type="primary" @click="postAdd">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      search: "",
      pagesize: 10,
      pagenum: 1,
      tableData: [],
      formTable: {
        //新增表单内容
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入活动名称", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入活动名称", trigger: "blur" }
        ]
      },
      formLabelWidth: "100px", //文本宽度
      AddForm: false //弹框的状态
    };
  },
  methods: {
    getUserList() {
      let token = localStorage.getItem("token");
      this.$http
        .get("users", {
          params: {
            pagesize: this.pagesize, //当前页容量
            pagenum: this.pagenum //总页数
          },
          //请求头带上token命令
          headers: {
            Authorization: token
          }
        })
        .then(res => {
          this.tableData = res.data.data.users;
        });
    },
    add() {
        //显示弹框
      this.AddForm = true;
    },
    postAdd() {
      let token = localStorage.getItem("token");
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.$http.post("users", this.formTable, {
            headers: {
              Authorization: token
            }
          }).then(res=>{
            //   console.log(res);
            let {meta}=res.data
            if (meta.status==201) {
                this.$message({
                    type:'success',
                    message:meta.msg
                })
                //重新渲染
                this.getUserList()
                //弹框数据清空
                this.formTable.username=''
                this.formTable.password=''
                this.formTable.email=''
                this.formTable.mobile=''
                //关闭弹窗
                this.AddForm = false
            }else {
                this.$message.error(meta.msg)
            }
              
          });
        } else {
          this.$message.error("参数有误");
        }
      });
    }
  },
  mounted() {
    this.getUserList();
  }
};
</script>

<style scoped>
.myrow {
  margin-top: 20px;
}
</style>
