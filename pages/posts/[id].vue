<template>
    <div>
        {{ route.params.id }}
    </div>
</template>

<script setup>
const route = useRoute();
</script>

<style lang="scss" scoped></style>
