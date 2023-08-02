<template>
<div class="group-view">
<div v-for="elem,indexData in groupData" :key="indexData" @click="drillDown(elem)" class="group-item">
      <div class="medium-8 medium-offset-2 columns card">
        <h1 class="text-headline">{{ elem.title }}</h1>
        <p class="text-body-1">{{ elem.extract }}</p>
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
    background: white;
    padding: 8px 10px;
    border: 1px solid;
    border-color: gainsboro;
    border-radius: 12px;
    box-shadow: 1px 1px 1px 1px gainsbo;
    cursor: pointer;
    margin-bottom: 10px;
}
.group-item:hover
{
    background:gainsboro;
}
</style>