<template>
    <transition name="tip-fade">
        <div class="tip-wrap" v-show="showing" v-bind:style="offset">{{text}}</div>
    </transition>
</template>

<script>
  const DEFAULT_DURATION = 3000;
  module.exports = {
    name: 'tip',
    data: () => {
      return {
          text: '',
          showing: false,
          offset: {
            top: '50%',
            left: '50%'
          }
      };
    },
    methods: {
      show: function(text, el) {
        if (!text) {
          return;
        }
        const offset = {
          top: '50%',
          left: '50%'
        };
        if (el) {
          const rect = el.getBoundingClientRect();
          offset.left = rect.left + 10 + 'px';
          offset.top = rect.top - 20 + 'px';
        }
        this.text = text;
        this.offset = offset;
        this.showing = true;
      },
      hide: function() {
        this.showing = false;
      }
    }
  }
</script>

<style scoped>
  .tip-wrap {
    position: fixed;
    padding: 0 10px;
    background: #2e3238;
    border-radius: 100px;
    height: 18px;
    font-size: 12px;
    color: #fff;
    line-height: 18px;
    text-align: center;
    z-index: 10000;
  }
  .tip-fade-enter-active, .tip-fade-leave-active {
    transition: opacity .5s;
  }
  .tip-fade-enter, .tip-fade-leave-active {
    opacity: 0
  }
</style>