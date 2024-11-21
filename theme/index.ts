"use client"
import type { UsageTheme } from "@yamada-ui/react"
import { extendTheme } from "@yamada-ui/react"

import * as styles from "./styles"
// import components from './components'
// import tokens from "./tokens/index";

const customTheme: UsageTheme = {
  styles,
  // components,
  //   ...tokens,
}

export default extendTheme(customTheme)()
