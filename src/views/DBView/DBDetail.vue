<template>
  <div class="view_detail">
    <img src="@/assets/back-removebg-preview.png" class="button-back" @click="routerBack">
  <div class="about">
    <h1 class="title-detail">Chi tiết ảnh hưởng</h1>
  </div>
  <vue-good-table :columns="columns" :rows="dataView"/>
</div>
</template>
<script>
import 'vue-good-table/dist/vue-good-table.css'
import { VueGoodTable } from 'vue-good-table';
       
export default {
    props:{
    },
    components: {
      VueGoodTable,
    },
    name:"DBDetail",
    methods:{
      routerBack()
      {
        this.$router.push('/');
      }
    },
    data()
    {
      return {
        columns: [
        {
          label: 'Tên bảng',
          field: 'table_name',
        },
        {
          label: 'Chú thích',
          field: 'description',
        },
      ],
        dataView:[
          {
            table_name:"sa_voucher",
            description:"Chứng từ bán hàng",
          },
          {
            table_name:"di_account",
            description:"Danh mục khách hàng",
          }
        ]
      }
    }
}
</script>
<style lang="scss" scoped>
.title-detail
{
  text-align: center;
}
.button-back
{
    width: 32px;
    position: fixed;
    right: 16px;
    cursor: pointer;
}
</style>
