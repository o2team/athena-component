<template>

</template>

<style lang="sass">

</style>

<script>
export default {
    data () {
        return {
            blist: []
        }
    },
    ready () {
        var that = this;

        var query = new AV.Query('Business');
        query.find().then(function(results) {
            that.blist = results;
        });
    },
    methods: {
        // 除了这样有没有更好的方式？
        getByBusiness: function() {
            this.$parent.getByBusiness();
        }
    }
}
</script>