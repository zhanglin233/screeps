/**
 * 一句一句整行复制敲进控制台
 * 注意 第四句话敲完后 看到效果后立刻要点控制台的暂停 不然新的消息冲出来有概率会让之前的出bug
 */

console.log(' <link rel="stylesheet" href="https://unpkg.com/element-ui/lib/theme-chalk/index.css">');
console.log('<div id="app1234567"><el-tree :data="data" :props="defaultProps"></el-tree></div>');
console.log('<script src="https://unpkg.com/vue/dist/vue.js"></script><script src="https://unpkg.com/element-ui/lib/index.js"></script>');
console.log('<script>new Vue({el: "#app1234567",data: function() {return {data: [{la: "一级",ch:[{la:"1-1",ch:[{la:"1-1-1"}]}]},{la:"二级",ch:[{la:"111",ch:[{la:"333"}]}]}],defaultProps: {children:"ch",label:"la"}}}})</script>');

