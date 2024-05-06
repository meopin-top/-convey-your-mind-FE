"use client"

import {useEffect} from "react"
import useFingerprint from "@/hooks/use-fingerprint"
import Storage from "@/store/local-storage"

const Fingerprint = () => {
  const {getHash, feature} = useFingerprint()

  useEffect(() => {
    getHash(feature).then((hash) => Storage.set("fingerprint", hash))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <></>
}

export default Fingerprint
