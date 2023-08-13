"use client"

import {useState} from "react"
import {BottomSheet} from ".."

const AllProjects = () => {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false) // TODO: handle 함수들이랑 함께 훅으로 뺄 수 있음

  function openBottomSheet() {
    setIsBottomSheetOpen(true)
    window.history.pushState({bottomSheetOpen: true}, "")

    // TODO: API 호출
  }

  function closeBottomSheet() {
    setIsBottomSheetOpen(false)

    // TODO: API로 받은 데이터 초기화
  }

  return (
    <>
      <button className="view-all shadow-lg" onClick={openBottomSheet}>
        {`> 전체 보기`}
      </button>
      <BottomSheet isOpen={isBottomSheetOpen} onClose={closeBottomSheet}>
        <span>aa</span>
        <div>여기 무언가</div>
        <div>적당히 무언가</div>
      </BottomSheet>
    </>
  )
}

export default AllProjects
