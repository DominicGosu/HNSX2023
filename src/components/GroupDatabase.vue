<template>
<div class="group-view">
<div v-for="elem,indexData in groupData" :key="indexData"  class="group-item">
      <div class="medium-8 medium-offset-2 columns card">
        <h2 class="text-headline" @click="drillDown(elem)">{{ elem.title }}</h2>
        <p class="text-body-1">{{ elem.extract }}</p>
        <div class="flex">
            <span class="text-link mr-20px">Xem rút gọn</span>
            <span class="text-link" @click="drillDown(elem)">Xem chi tiết</span>
        </div>
      </div>
    </div>
</div>
</template>
<script>
export default {
    props:{
        groupData:{
            default:()=>[],
            type:Array
        }
    },
    name:"GroupDatabase",
    methods:{
        drillDown(element)
        {
            this.$router.push({ name: 'dbdetail', params: element });
        }
    }
}
</script>
<style lang="scss">
.group-view
{
    overflow: auto;
    height: calc(100vh - 340px);
    width: calc(100vw - 10px);
}
.group-item
{
    padding: 8px 10px;
    border-bottom: 1px solid gainsboro;
    margin-bottom: 10px;
    h2
    {
        margin-top:8px;
    }
}
.group-item:hover
{
    // background:gainsboro;
}
.text-link
{
    color:#5D9BFB;
    cursor: pointer;
}
.mr-20px
{
    margin-right:20px;
}
</style>