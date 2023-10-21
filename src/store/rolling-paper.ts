import {createContext} from "react"
import type {TStore} from "@/@types/rolling-paper"

const Store = createContext<TStore>({
  drawingMode: null,
  resetDrawingMode: function () {},
})

export default Store
