<template>
  <div class="g-hud">
    <div class="face face--top">
      <slot name="top" />
    </div>

    <div class="face face--right">
      <slot name="right" />
    </div>

    <div class="face face--down">
      <slot name="down" />
    </div>

    <div class="face face--left">
      <slot name="left" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'GHud'
}
</script>

<style lang="scss">
.g-hud {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  perspective: 600px;
  overflow: hidden;

  .face {
    position: absolute;
    padding: 20px;
    display: flex;
    &--top {
      width: 100%;
      height: 150px;
      top: 0;
      left: 0;
      transform: rotateX(10deg);
      transform-origin: 50% 0%;
    }
    &--right {
      width: 300px;
      top: 0;
      right: 0;
      bottom: 0;
      transform: rotateY(-15deg);
      transform-origin: 100% 0%;
      justify-content: flex-end;
    }
    &--down {
      width: 100%;
      height: 150px;
      bottom: 0;
      left: 0;
      transform: rotateX(-10deg);
      transform-origin: 50% 100%;
    }
    &--left {
      width: 300px;
      top: 0;
      left: 0;
      bottom: 0;
      transform: rotateY(15deg);
      transform-origin: 0% 0%;
    }
  }
}
</style>
