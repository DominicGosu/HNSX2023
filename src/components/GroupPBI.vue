<template>
<div class="group">
<div v-for="elem,indexData in groupData" :key="indexData">
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
}
</script>