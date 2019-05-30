<template>
  <div id="loginBox">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-position="top"
      status-icon
      label-width="100px"
      class="demo-ruleForm"
    >
      <h3>用户登录</h3>
      <el-form-item label="用户名" prop="username">
        <el-input type="text" v-model="ruleForm.username" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="my-btn" @click="login">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      //用户对象
      ruleForm: {
        username: "",
        password: ""
      },
      //验证规则
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    //登录按钮绑定事件
    login: function() {
      //判断form中的元素是否满足条件
      this.$refs.ruleForm.validate(valid => {
        //valid bulr值 正确的返回true 错误的返回false
        if (valid) {
          //axios提交登录申请
          this.$http.post("login", this.ruleForm).then(res => {
            var { data, meta } = res.data;
            if (meta.status === 200) {
              this.$message({
                message: meta.msg,
                type: "success"
              });
              //跳转到主页
              this.$router.push("home");
            } else {
              this.$message.error(meta.msg);
            }
          });
        } else {
          this.$message.error("请输入正确的用户名或密码");
          return false;
        }
      });
    }
  }
};
</script>

<style scoped>
#loginBox {
  width: 500px;
  /* height: 200px; */
  background-color: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 40px;
  border-radius: 10px;
}
#loginBox .my-btn {
  width: 100%;
}
</style>
