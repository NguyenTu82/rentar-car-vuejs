<template>
  <transition name="modal-animation">
    <div v-show="modalActive" class="modal">
      <transition name="modal-animation-inner">
        <div v-show="modalActive" class="modal__inner--cus">
          <div class="modal-inner modal_inner--cus">
            <slot />
            <a @click="close" :class="disabledClass">{{titleClose}}</a>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
export default {
  props: ["modalActive","titleClose", "checkScroll"],
  setup(props, { emit }) {
    const close = () => {
      if (props.checkScroll) {
        emit("close");
      }
    };
    return { close };
  },
  computed: {
    disabledClass: (props) => {
      return props.checkScroll ? "" : "a__disabled"
    }
  }
};
</script>

<style lang="scss" scoped>
::-webkit-scrollbar {
  -webkit-appearance: none;
  width: 8px;
}
.a__disabled {
  pointer-events: none;
  cursor: default;
  opacity: .7;
}
.modal-animation-enter-active,
.modal-animation-leave-active {
  transition: opacity 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02);
}
.modal-animation-enter-from,
.modal-animation-leave-to {
  opacity: 0;
}
.modal-animation-inner-enter-active {
  transition: all 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02) 0.15s;
}
.modal-animation-inner-leave-active {
  transition: all 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02);
}
.modal-animation-inner-enter-from {
  opacity: 0;
  transform: scale(0.8);
}
.modal-animation-inner-leave-to {
  transform: scale(0.8);
}
.modal {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(255, 255, 255, 0.7);
  margin-top: 40px;
  .modal__inner--cus {
    max-width: 500px;
    max-height: 85%;
  }
  .modal_inner--cus {
    overflow: hidden;
    display: inline-grid;
  }
  .modal-inner {
    position: relative;
    max-width: 500px;
    height: 100%;
    width: auto;
    box-shadow: 0 4px 6px 2px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    background-color: #fff;
    padding: 30px 50px;

    i {
      position: absolute;
      top: 15px;
      right: 15px;
      font-size: 20px;
      cursor: pointer;
      &:hover {
        color: crimson;
      }
    }
    a {
      display: inline-flex;
      text-decoration: none; 
      color: white ;
      background-color: #2D419A;
      justify-content: center;
      align-items: center;
      width: 100%;
      max-width: 500px;
      height: 50px;
      font-size: 14px;
      border-radius: 25px;
      font-weight: 500;
      padding: 0 1.2rem;
      margin-top: 1rem;
    }
    a:hover {
      background: #0C47A1;
      cursor: pointer;
      transition: all .3s ease-out;
    }
  }
  
}

@media screen and (max-width: 480px) {
  .modal {
    margin-top: 60px;
    .modal__inner--cus {
    max-height: 86%;
    }
  }
}
</style>