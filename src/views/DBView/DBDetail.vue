<template>
  <div class="view_detail">
    <div @click="routerBack">Quay lại</div>
  <div class="about">
    <h1>Chi tiết ảnh hưởng</h1>
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
