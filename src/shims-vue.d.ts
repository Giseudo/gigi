/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '*.glsl' {
  const value: string
  export default value
}

declare var process : {
  env: {
    VUE_APP_SERVER_ADDRESS: string
  }
}
