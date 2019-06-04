<template>
  <el-card>
    <!-- 面包屑导航 -->
    <BreadNav :navone="'权限管理'" :navtwo="'角色列表'"/>
    <el-row class="myrow">
      <el-col :span="8">
        <!-- 新增按钮 -->
        <el-button plain @click="addRoles">新增角色</el-button>
      </el-col>
    </el-row>
    <!-- 角色管理 -->
    <el-table :data="roleData" :border="true" style="width: 100%">
      <el-table-column type="expand">
        <!-- 角色展开项 -->
        <template slot-scope="scope">
          <el-row v-for="(item1,index1) in scope.row.children " :key="index1">
            <!-- 一级权限 -->
            <el-col :span="4">
              <el-tag closable @close="delTag(scope.row.id,item1.id,scope)">{{item1.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <!-- 二级权限 -->
            <el-col :span="20">
              <el-row v-for="(item2,index2) in item1.children" :key="index2">
                <el-col :span="4">
                  <el-tag
                    closable
                    type="success"
                    @close="delTag(scope.row.id,item2.id,scope)"
                  >{{item2.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <!-- 三级权限 -->
                <el-col :span="20">
                  <el-tag
                    class="mytag"
                    closable
                    type="warning"
                    v-for="(item3,index3) in item2.children"
                    :key="index3"
                    @close="delTag(scope.row.id,item3.id,scope)"
                  >{{item3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="roleName" label="角色名称"></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-edit"
            @click="editRole(scope.row.id)"
            plain
          ></el-button>
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="delRole(scope.row.id)"
            plain
          ></el-button>
          <el-button
            type="warning"
            size="mini"
            icon="el-icon-check"
            @click="change(scope.row.id,scope)"
            plain
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增角色弹框 -->
    <el-dialog title="新增角色" :visible.sync="AddRolesForm">
      <el-form :model="formTable" :rules="rules" ref="ruleForm">
        <el-form-item label="角色名称" prop="roleName" :label-width="formLabelWidth">
          <el-input v-model="formTable.roleName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc" :label-width="formLabelWidth">
          <el-input v-model="formTable.roleDesc" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="AddRolesForm =false">取 消</el-button>
        <el-button @click="postAdd">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑角色弹框 -->
    <el-dialog title="编辑角色" :visible.sync="EditRolesForm">
      <el-form :model="formTable" :rules="rules" ref="ruleForm">
        <el-form-item label="角色名称" prop="roleName" :label-width="formLabelWidth">
          <el-input v-model="formTable.roleName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc" :label-width="formLabelWidth">
          <el-input v-model="formTable.roleDesc" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="EditRolesForm =false">取 消</el-button>
        <el-button @click="postEdit(formTable.roleId)">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分配权限 -->
    <el-dialog title="分配权限" :visible.sync="changeForm">
      <!-- 
        1.props:配置情况
        2.load: 加载子数据的方法
        4.show-checkbox 节点是否可以被选择
        5.node-key: 每个树节点用来作为唯一标识的属性
      -->
      <el-tree
        :data="Treedata"
        show-checkbox
        node-key="id"
        :default-checked-keys="defaultchecked"
        ref="tree"
        :default-expand-all="true"
        :props="props"
      ></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="changeForm = false">取 消</el-button>
        <el-button type="primary" @click="changeRoles">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import BreadNav from "../home/layout/BreadNav/BreadNav.vue";
export default {
  data() {
    return {
      defaultchecked: [],
      roleData: [],
      formTable: {
        roleName: "",
        roleDesc: ""
      },
      roleid: "",
      Treedata: [],
      rules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" }
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" }
        ]
      },
      props: {
        children: "children", //指定子树为节点对象的某个属性值
        label: "authName" //指定节点标签为节点对象的某个属性值
      },
      formLabelWidth: "100px",
      AddRolesForm: false, //新增角色的弹框状态
      EditRolesForm: false, //编辑角色的弹框状态
      changeForm: false //分配权限的弹框状态
    };
  },
  methods: {
    //获取角色数据
    async getRoleLise() {
      let res = await this.$http.get("roles");
      //解构
      let { data, meta } = res.data;
      if (meta.status == 200) {
        this.roleData = data;
      } else {
        this.$message.error(meta.msg);
      }
    },
    //显示新增角色弹框
    addRoles() {
      //打开清空数据框内容
      this.formTable.roleName = "";
      this.formTable.roleDesc = "";
      this.AddRolesForm = true;
    },
    //新增角色数据
    async postAdd() {
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          let res = await this.$http.post("roles", {
            roleName: this.formTable.roleName,
            roleDesc: this.formTable.roleDesc
          });

          let { meta, data } = res.data;
          if (meta.status == 201) {
            this.$message({
              type: "success",
              message: meta.msg
            });
            //重新加载数据
            this.getRoleLise();
            // 关闭弹窗
            this.AddRolesForm = false;
            //清空弹框数据
            this.formTable.roleName = "";
            this.formTable.roleDesc = "";
          } else {
            this.$message.error(meta.msg);
          }
        } else {
          this.$message.error("参数有误");
        }
      });
    },
    //打开编辑角色弹框
    editRole(id) {
      this.EditRolesForm = true;
      //根据id获取角色数据
      this.$http.get(`roles/${id}`).then(res => {
        //解构
        let { meta, data } = res.data;
        if (meta.status == 200) {
          this.formTable = data;
        } else {
          this.$message.error(meta.msg);
        }
      });
    },
    //提交编辑角色数据
    async postEdit(id) {
      let res = await this.$http.put(`roles/${id}`, {
        roleName: this.formTable.roleName,
        roleDesc: this.formTable.roleDesc
      });
      let { meta, data } = res.data;
      if (meta.status == 200) {
        this.$message({
          type: "success",
          message: meta.msg
        });
        //重新加载数据
        this.getRoleLise();
        //关闭弹窗
        this.EditRolesForm = false;
        //清空弹框数据
        this.formTable.roleName = "";
        this.formTable.roleDesc = "";
      } else {
        this.$message.error(meta.msg);
      }
    },
    //删除角色数据
    delRole(id) {
      this.$confirm("确定删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let res = await this.$http.delete(`roles/${id}`);
          let { meta } = res.data;
          if (meta.status == 200) {
            this.$message({
              type: "success",
              message: meta.msg
            });
            //重新加载数据
            this.getRoleLise();
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
    //获取树状列表数据
    async getTreeList(scope) {
      //一级权限
      scope.row.children.forEach(item1 => {
        //二级权限
        item1.children.forEach(item2 => {
          //三级权限
          item2.children.forEach(item3 => {
            //打开默认选中项
            this.defaultchecked.push(item3.id);
          });
        });
      });
      let res = await this.$http.get(`rights/tree`);
      let { meta, data } = res.data;
      if (meta.status == 200) {
        //树状数据获取
        this.Treedata = data;
      }
    },
    //打开权限分配框
    change(id, scope) {
      //清空之前的选中状态
      this.defaultchecked = [];
      this.roleid = id;
      this.changeForm = true;
      this.getTreeList(scope);
    },

    //提交需要修改的权限
    async changeRoles() {
      //获取当前选中角色id
      let roleid = this.roleid;
      //选中的权限
      let rolesid = this.$refs.tree.getCheckedKeys();
      //半选的权限
      let halfid = this.$refs.tree.getHalfCheckedKeys();
      //合并数组
      let arr = [...halfid, ...rolesid];
      //转换成字符串格式
      let rid = arr.join(",");
      let res = await this.$http.post(`roles/${roleid}/rights`, { rids: rid });
      let { meta, data } = res.data;
      if (meta.status == 200) {
        this.$message({
          type: "success",
          message: meta.msg
        });
        //关闭弹窗
        this.changeForm = false;
        //重新加载数据
        this.getRoleLise();
      } else {
        this.$message.error(meta.msg);
      }
    },
    //删除角色权限
    async delTag(id, rid, scope) {
      // console.log(id,rid);
      let res = await this.$http.delete(`roles/${id}/rights/${rid}`);
      let { meta, data } = res.data;
      if (meta.status == 200) {
        this.$message({
          type: "success",
          message: meta.msg
        });
        //返回值重新赋值到当前数据中
        scope.row.children = data;
      } else {
        this.$message.error(meta.msg);
      }
    }
  },
  mounted() {
    //加载数据
    this.getRoleLise();
  },
  components: {
    BreadNav
  }
};
</script>

<style>
.myrow {
  margin-top: 20px;
}
.mytag {
  margin-right: 10px;
  margin-bottom: 5px;
}
</style>
