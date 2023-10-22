import {useState, type ReactNode} from "react"
import {render, screen, fireEvent, waitFor} from "@testing-library/react"
import Component from "@/components/rolling-paper/creation/ConfirmedPopUp"
import {
  WhomStore,
  PersonnelStore,
  TypeStore,
  DDayStore,
  SharingCodeStore,
} from "@/components/rolling-paper/creation/Context"
import useInput from "@/hooks/use-input"
import {formatDateTime} from "@/utils/formatter"
import {calculateDateOffset} from "@/utils/date"
import {ROLLING_PAPER} from "@/constants/response-code"
import ROUTE from "@/constants/route"
import type {TRollingPaperType} from "@/@types/rolling-paper"

type TProps = {
  children: ReactNode
}

const TO_WHOM = "whom"
const PERSONNEL = "5"
const TYPE: TRollingPaperType = {
  text: "text",
  template: "template",
}
const D_DAY = 50
const SHARING_CODE = "sharingCode"

const WhomProvider = ({children}: TProps) => {
  const [toWhom, handleToWhom] = useInput(TO_WHOM)

  return (
    <WhomStore.Provider value={{toWhom, handleToWhom}}>
      {children}
    </WhomStore.Provider>
  )
}

const PersonnelProvider = ({children}: TProps) => {
  const [personnel, handlePersonnel, setPersonnel] = useInput(PERSONNEL)

  return (
    <PersonnelStore.Provider value={{personnel, handlePersonnel, setPersonnel}}>
      {children}
    </PersonnelStore.Provider>
  )
}

const TypeProvider = ({children}: TProps) => {
  const [type, setType] = useState<TRollingPaperType>(TYPE)

  function handleType(type: TRollingPaperType) {
    setType(type)
  }

  return (
    <TypeStore.Provider value={{type, handleType}}>
      {children}
    </TypeStore.Provider>
  )
}

const DDayProvider = ({children}: TProps) => {
  const [dDay, setDDay] = useState<number>(D_DAY)

  function handleDDay(dDay: number) {
    setDDay(dDay)
  }

  return (
    <DDayStore.Provider value={{dDay, handleDDay}}>
      {children}
    </DDayStore.Provider>
  )
}

const SharingCodeProvider = ({children}: TProps) => {
  const [sharingCode, handleSharingCode] = useInput(SHARING_CODE)

  return (
    <SharingCodeStore.Provider value={{sharingCode, handleSharingCode}}>
      {children}
    </SharingCodeStore.Provider>
  )
}

const onCloseMock = jest.fn()

const ConfirmedPopUp = () => {
  return (
    <WhomProvider>
      <PersonnelProvider>
        <TypeProvider>
          <DDayProvider>
            <SharingCodeProvider>
              <Component isAlerting onClose={onCloseMock} />
            </SharingCodeProvider>
          </DDayProvider>
        </TypeProvider>
      </PersonnelProvider>
    </WhomProvider>
  )
}

const routerPushMock = jest.fn()
const requestMock = jest.fn()

jest.mock("next/navigation", () => ({
  __esModule: true,
  useRouter: () => ({
    push: routerPushMock,
  }),
}))
jest.mock("../../../../hooks/use-request.ts", () => ({
  __esModule: true,
  default: () => ({
    request: requestMock,
  }),
}))
jest.mock("../../../../components/FlowAlert.tsx", () => ({
  __esModule: true,
  default: ({isAlerting}: {isAlerting: boolean}) => (
    <>ErrorAlert {isAlerting ? "open" : "close"}</>
  ),
}))

describe("ConfirmedPopUp", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it("올바르게 렌더링한다.", async () => {
    // given, when
    render(<ConfirmedPopUp />)

    const title = screen.getByText(/마지막으로 확인해주세요/)
    const toWhom = screen.getByText(TO_WHOM)
    const personnel = screen.getByText(`${PERSONNEL}명`)
    const type = screen.getByText(TYPE.text)
    const expiredAt = screen.getByText(
      `${formatDateTime(calculateDateOffset(D_DAY))} (D-${D_DAY})`
    )
    const closeButton = screen.getByRole("button", {
      name: "취소",
    })
    const submitButton = screen.getByRole("button", {
      name: "시작하기",
    })
    const errorAlert = await screen.findByText("ErrorAlert close")

    // then
    expect(title).toBeInTheDocument()
    expect(toWhom).toBeInTheDocument()
    expect(personnel).toBeInTheDocument()
    expect(type).toBeInTheDocument()
    expect(expiredAt).toBeInTheDocument()
    expect(closeButton).toBeInTheDocument()
    expect(submitButton).toBeInTheDocument()
    expect(errorAlert).toBeInTheDocument()
  })

  it("'취소' 버튼을 누르면 onClose가 호출된다.", () => {
    // given
    render(<ConfirmedPopUp />)

    const closeButton = screen.getByRole("button", {
      name: "취소",
    })

    // when
    fireEvent.click(closeButton)

    // then
    expect(onCloseMock).toHaveBeenCalledTimes(1)
  })

  it("'시작하기' 버튼을 클릭할 때 이미 존재하는 공유코드면 ErrorAlert가 렌더링된다.", async () => {
    // given
    ;(requestMock as jest.Mock).mockResolvedValueOnce({
      code: ROLLING_PAPER.CREATION.DUPLICATED_SHARING_CODE,
    })

    render(<ConfirmedPopUp />)

    const submitButton = screen.getByRole("button", {
      name: "시작하기",
    })

    // when
    fireEvent.click(submitButton)

    // then
    const errorAlert = await screen.findByText("ErrorAlert open")

    expect(errorAlert).toBeInTheDocument()
  })

  it("'시작하기' 버튼을 클릭할 때 API 호출이 실패하면 ErrorAlert가 렌더링된다.", async () => {
    // given
    ;(requestMock as jest.Mock).mockResolvedValueOnce({
      code: ROLLING_PAPER.CREATION.FAILURE,
    })

    render(<ConfirmedPopUp />)

    const submitButton = screen.getByRole("button", {
      name: "시작하기",
    })

    // when
    fireEvent.click(submitButton)

    // then
    const errorAlert = await screen.findByText("ErrorAlert open")

    expect(errorAlert).toBeInTheDocument()
  })

  it("'시작하기' 버튼을 클릭할 때 API 호출에 성공하면 롤링페이퍼 공유하기 페이지로 이동한다.", async () => {
    // given
    ;(requestMock as jest.Mock).mockResolvedValueOnce({
      code: ROLLING_PAPER.CREATION.SUCCESS,
      data: {
        inviteCode: SHARING_CODE,
      },
    })

    render(<ConfirmedPopUp />)

    const submitButton = screen.getByRole("button", {
      name: "시작하기",
    })

    // when
    fireEvent.click(submitButton)

    // then
    await waitFor(() => {
      expect(routerPushMock).toHaveBeenCalledWith(
        `${ROUTE.ROLLING_PAPER_CREATION}/${SHARING_CODE}`
      )
    })
  })
})
