<template>
  <input type="text" :value="value" @input="handleChange" />
</template>

<script setup lang="ts">
import { FiledPropsDefine } from '../types'

const props = defineProps(FiledPropsDefine)
function handleChange(e) {
  props.change(e.target.value)
}
</script>

<style scoped></style>
