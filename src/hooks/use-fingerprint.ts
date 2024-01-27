"use client"

import {useMemo} from "react"

type TBaseFont = "monospace" | "sans-serif" | "serif"

type TFont =
  | "sans-serif-thin"
  | "ARNO PRO"
  | "Agency FB"
  | "Arabic Typesetting"
  | "Arial Unicode MS"
  | "AvantGarde Bk BT"
  | "BankGothic Md BT"
  | "Batang"
  | "Bitstream Vera Sans Mono"
  | "Calibri"
  | "Century"
  | "Century Gothic"
  | "Clarendon"
  | "EUROSTILE"
  | "Franklin Gothic"
  | "Futura Bk BT"
  | "Futura Md BT"
  | "GOTHAM"
  | "Gill Sans"
  | "HELV"
  | "Haettenschweiler"
  | "Helvetica Neue"
  | "Humanst521 BT"
  | "Leelawadee"
  | "Letter Gothic"
  | "Levenim MT"
  | "Lucida Bright"
  | "Lucida Sans"
  | "Menlo"
  | "MS Mincho"
  | "MS Outlook"
  | "MS Reference Specialty"
  | "MS UI Gothic"
  | "MT Extra"
  | "MYRIAD PRO"
  | "Marlett"
  | "Meiryo UI"
  | "Microsoft Uighur"
  | "Minion Pro"
  | "Monotype Corsiva"
  | "PMingLiU"
  | "Pristina"
  | "SCRIPTINA"
  | "Segoe UI Light"
  | "Serifa"
  | "SimHei"
  | "Small Fonts"
  | "Staccato222 BT"
  | "TRAJAN PRO"
  | "Univers CE 55 Medium"
  | "Vrinda"
  | "ZWAdobeF"

// 출처: https://dev.gmarket.com/94
// 알고리즘을 이해한 게 아니기 때문에 테스트 생략
export default function useFingerprint() {
  const feature = useMemo(() => {
    let features = ""

    if (typeof window === "undefined") {
      return features
    }

    const {dimensions, maxTouchPoints, touchEvent, touchStart} =
      getScreenFeatures()

    features += getFontFeatures()
    features += dimensions.join(",")
    features += maxTouchPoints
    features += touchEvent
    features += touchStart
    features += getCanvasFeatures()

    return features
  }, [])

  function getFontFeatures(): string {
    const spansContainer = document.createElement("div")
    spansContainer.style.setProperty("visibility", "hidden", "important")

    const testString = "mmMwWLliI0O&1"
    const textSize = "48px"

    const baseFonts: TBaseFont[] = ["monospace", "sans-serif", "serif"]

    const fontList: TFont[] = [
      "sans-serif-thin",
      "ARNO PRO",
      "Agency FB",
      "Arabic Typesetting",
      "Arial Unicode MS",
      "AvantGarde Bk BT",
      "BankGothic Md BT",
      "Batang",
      "Bitstream Vera Sans Mono",
      "Calibri",
      "Century",
      "Century Gothic",
      "Clarendon",
      "EUROSTILE",
      "Franklin Gothic",
      "Futura Bk BT",
      "Futura Md BT",
      "GOTHAM",
      "Gill Sans",
      "HELV",
      "Haettenschweiler",
      "Helvetica Neue",
      "Humanst521 BT",
      "Leelawadee",
      "Letter Gothic",
      "Levenim MT",
      "Lucida Bright",
      "Lucida Sans",
      "Menlo",
      "MS Mincho",
      "MS Outlook",
      "MS Reference Specialty",
      "MS UI Gothic",
      "MT Extra",
      "MYRIAD PRO",
      "Marlett",
      "Meiryo UI",
      "Microsoft Uighur",
      "Minion Pro",
      "Monotype Corsiva",
      "PMingLiU",
      "Pristina",
      "SCRIPTINA",
      "Segoe UI Light",
      "Serifa",
      "SimHei",
      "Small Fonts",
      "Staccato222 BT",
      "TRAJAN PRO",
      "Univers CE 55 Medium",
      "Vrinda",
      "ZWAdobeF",
    ]

    const body = document.getElementsByTagName("body")[0]

    const span = document.createElement("span")
    span.style.fontSize = textSize
    span.textContent = testString
    const defaultWidth: {[key in TBaseFont]?: number} = {}
    const defaultHeight: {[key in TBaseFont]?: number} = {}
    for (const index in baseFonts) {
      span.style.fontFamily = baseFonts[index]
      body.appendChild(span)
      defaultWidth[baseFonts[index]] = span.offsetWidth
      defaultHeight[baseFonts[index]] = span.offsetHeight
      body.removeChild(span)
    }

    const detect = (font: TFont) => {
      let detected = false
      for (const index in baseFonts) {
        span.style.fontFamily = font + "," + baseFonts[index]
        body.appendChild(span)
        const matched =
          span.offsetWidth != defaultWidth[baseFonts[index]] ||
          span.offsetHeight != defaultHeight[baseFonts[index]]
        body.removeChild(span)
        detected = detected || matched
      }
      return detected
    }

    return fontList.filter(detect).join(",")
  }

  function getScreenFeatures(): {
    dimensions: number[]
    maxTouchPoints: number
    touchEvent: any
    touchStart: boolean
  } {
    const dimensions = [screen.width, screen.height]
    dimensions.sort().reverse()

    let maxTouchPoints = 0
    let touchEvent
    if (navigator.maxTouchPoints !== undefined) {
      maxTouchPoints = navigator.maxTouchPoints
    }

    try {
      document.createEvent("TouchEvent")
      touchEvent = true
    } catch {
      touchEvent = false
    }
    const touchStart = "ontouchstart" in window

    return {
      dimensions,
      maxTouchPoints,
      touchEvent,
      touchStart,
    }
  }

  function getCanvasFeatures(): string {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (!ctx) {
      throw new Error("canvas 2d 없음")
    }
    const txt = "abz190#$%^@£éú"

    ctx.fillStyle = "rgb(255,0,255)"
    ctx.beginPath()
    ctx.rect(20, 20, 150, 100)
    ctx.fill()
    ctx.stroke()
    ctx.closePath()
    ctx.beginPath()
    ctx.fillStyle = "rgb(0,255,255)"
    ctx.arc(50, 50, 50, 0, Math.PI * 2, true)
    ctx.fill()
    ctx.stroke()
    ctx.closePath()

    ctx.textBaseline = "top"
    ctx.font = '17px "Arial 17"'
    ctx.textBaseline = "alphabetic"
    ctx.fillStyle = "rgb(255,5,5)"
    ctx.rotate(0.03)
    ctx.fillText(txt, 4, 17)
    ctx.fillStyle = "rgb(155,255,5)"
    ctx.shadowBlur = 8
    ctx.shadowColor = "red"
    ctx.fillRect(20, 12, 100, 5)

    return canvas.toDataURL()
  }

  // get hash
  async function getHash(str: string, algorithm = "SHA-256"): Promise<string> {
    return new Promise(async (resolve) => {
      const strBuf = new TextEncoder().encode(str)
      const hash = await crypto.subtle.digest(algorithm, strBuf)

      let result = ""
      const view = new DataView(hash)
      for (let i = 0; i < hash.byteLength; i += 4) {
        result += ("00000000" + view.getUint32(i).toString(16)).slice(-8)
      }

      resolve(result)
    })
  }

  return {
    feature,
    getHash,
  }
}
