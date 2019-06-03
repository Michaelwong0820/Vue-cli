<template>
  <el-card>
    <!-- 面包屑导航 -->
   <BreadNav :navone="'用户管理'" :navtwo="'用户列表'"/>
    <!-- 搜索框 -->
    <el-row class="myrow">
      <el-col :span="8">
        <el-input placeholder="请输入内容" v-model="search" class="input-with-select">
          <el-button slot="append" icon="el-icon-search" @click="searchData"></el-button>
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
          <el-switch
            @change="changes(scope.row.id,scope.row.mg_state)"
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-edit"
            plain
            @click="editData(scope.row.id)"
          ></el-button>
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="delData(scope.row.id)"
            plain
          ></el-button>
          <el-button
            type="success"
            size="mini"
            icon="el-icon-check"
            @click="check(scope.row.id)"
            plain
          ></el-button>
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
        <el-button @click="cancel();AddForm=false">取 消</el-button>
        <el-button type="primary" @click="postAdd">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑用户弹框 -->
    <el-dialog title="修改用户" :visible.sync="editForm">
      <el-form :model="formTable" :rules="rules" ref="ruleForms">
        <el-form-item label="用户名" prop="username" :label-width="formLabelWidth">
          <el-input :disabled="true" v-model="formTable.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="formTable.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="formTable.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel();editForm=false">取 消</el-button>
        <el-button type="primary" @click="postEdit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改用户角色 -->
    <el-dialog title="分配角色" :visible.sync="roleForm">
      <el-form :model="formTable" :rules="rules" ref="ruleForms">
        <el-form-item
          label="用户名"
          prop="username"
          :label-width="formLabelWidth"
        >{{formTable.username}}</el-form-item>
        <el-form-item label="角色" :label-width="formLabelWidth">
          <el-select placeholder="请选择" v-model="formTable.rid">
            <el-option label="请选择" :value="-1"></el-option>

            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel();roleForm=false">取 消</el-button>
        <el-button type="primary" @click="postRole(formTable.id)">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
//引入面包屑导航组件
import BreadNav from '../home/layout/BreadNav/BreadNav.vue'
export default {
  data() {
    return {
      search: "",
      pagesize: 10,
      pagenum: 1,
      tableData: [],
      options: [],
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
      AddForm: false, //新增弹框的状态
      editForm: false, //修改弹框的状态
      roleForm: false //角色弹框的状态
    };
  },
  methods: {
    //获取数据
    getUserList() {
      this.$http
        .get("users", {
          params: {
            pagesize: this.pagesize, //当前页容量
            pagenum: this.pagenum, //总页数
            query: this.search // 搜索条件
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
    //新增用户数据
    postAdd() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.$http
            .post("users", {
              username: this.formTable.username,
              password: this.formTable.password,
              email: this.formTable.email,
              mobile: this.formTable.mobile
            })
            .then(res => {
              //   console.log(res);
              let { meta } = res.data;
              if (meta.status == 201) {
                this.$message({
                  type: "success",
                  message: meta.msg
                });
                //重新渲染
                this.getUserList();
                //弹框数据清空
                this.formTable.username = "";
                this.formTable.password = "";
                this.formTable.email = "";
                this.formTable.mobile = "";
                //关闭弹窗
                this.AddForm = false;
              } else {
                this.$message.error(meta.msg);
              }
            });
        } else {
          this.$message.error("参数有误");
        }
      });
    },
    //搜索条件内容
    searchData() {
      this.getUserList();
    },
    // //切换用户状态属性
    changes(id, state) {
      this.$http.put(`users/${id}/state/${state}`).then(res => {
        let { meta, data } = res.data;
        if (meta.status == 200) {
          this.$message({
            type: "success",
            message: meta.msg
          });
        } else {
          this.$message.error(meta.msg);
        }
      });
    },
    //获取修改用户属性
    editData(id) {
      //显示弹框
      this.editForm = true;
      //获取当前用户数据
      this.$http.get(`users/${id}`).then(res => {
        let { meta, data } = res.data;
        if (meta.status === 200) {
          this.formTable = data;
        }
      });
    },
    //提交修改用户数据
    postEdit() {
      this.$http
        .put(`users/${this.formTable.id}`, {
          email: this.formTable.email,
          mobile: this.formTable.mobile
        })
        .then(res => {
          let { meta, data } = res.data;
          if (meta.status == 200) {
            this.$message({
              type: "success",
              message: meta.msg
            });
            //重新获取数据
            this.getUserList();
            //清空列表数据
            this.formTable.username = "";
            this.formTable.password = "";
            this.formTable.email = "";
            this.formTable.mobile = "";
            //关闭弹框
            this.editForm = false;
          } else {
            this.$message.error(meta.msg);
          }
        });
    },
    //删除单个用户数据
    delData(id) {
      //增加删除确认条件
      this.$confirm("确定删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let req = await this.$http.delete(`users/${id}`);
          //解构
          let { meta, data } = req.data;
          if (meta.status == 200) {
            this.$message({
              type: "success",
              message: meta.msg
            });
            //重新加载
            this.getUserList();
          } else {
            this.$message.error(meta.msg);
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //打开角色修改弹窗
    async check(id) {
      this.roleForm = true;
      let res = await this.$http.get(`users/${id}`);
      //解构
      let { data, meta } = res.data;
      if (meta.status == 200) {
        this.formTable = data;
      } else {
        this.$message.error("参数有误");
      }
    },
    //获取下拉框的角色数据
    async getRoles() {
      let res = await this.$http.get("roles");
      //解构
      let { meta, data } = res.data;
      if (meta.status == 200) {
        this.options = data;
      }
    },
    //提交角色修改数据
    async postRole(id) {
      let res = await this.$http.put(`users/${id}/role`, {
        rid: this.formTable.rid
      });
      let { data, meta } = res.data;
      if (meta.status == 200) {
        this.$message({
          type: "success",
          message: meta.msg
        });
        //关闭弹窗
        this.roleForm = false;
        //清空文本数据
        this.formTable.username = "";
        this.formTable.password = "";
        this.formTable.email = "";
        this.formTable.mobile = "";
      } else {
        this.$message.error(meta.msg);
      }
    },
    //给所有取消按钮绑定点击事件
    cancel() {
      //清空文本框数据
      this.formTable.username = "";
      this.formTable.password = "";
      this.formTable.email = "";
      this.formTable.mobile = "";
    }
  },
  mounted() {
    //加载数据
    this.getUserList();
    //加载下拉框数据
    this.getRoles();
  },
  components :{
    BreadNav
  }
};
</script>

<style scoped>
.myrow {
  margin-top: 20px;
}
</style>
