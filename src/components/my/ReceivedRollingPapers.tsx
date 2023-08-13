"use client"

import {useState, useEffect} from "react"
import AllReceivedRollingPapers from "./AllReceivedRollingPapers"
import Link from "next/link"

type TResponse = {
  id: number
  name: string
  receivedAt: string
  link: string
}

const data: TResponse[] = [
  {
    id: 1,
    name: "프로젝트 이름 텍스트 노출 완전 길게 테스트해보기 완전 길겡ㅇㅇㅇㅇㅇㅇ",
    receivedAt: "Sat Aug 12 2023 21:30:16 GMT+0900",
    link: "https://www.naver.com",
  },
  {
    id: 2,
    name: "프로젝트 이름 텍스트 노출",
    receivedAt: "Sat Aug 12 2023 21:30:16 GMT+0900",
    link: "https://www.naver.com",
  },
  {
    id: 3,
    name: "프로젝트 이름 텍스트 노출",
    receivedAt: "Sat Aug 12 2023 21:30:16 GMT+0900",
    link: "https://www.naver.com",
  },
  {
    id: 4,
    name: "프로젝트 이름 텍스트 노출",
    receivedAt: "Sat Aug 12 2023 21:30:16 GMT+0900",
    link: "https://www.naver.com",
  },
]

const ReceivedRollingPapers = () => {
  // TODO: API 연동하면 RSC로 변경

  const [rollingPapers, setRollingPapers] = useState<TResponse[]>([])

  useEffect(() => {
    setRollingPapers(data)
  }, [])

  return (
    <div className="rolling-papers">
      <div className="header mb-2">
        <h5 className="title"># 내가 받은 롤링페이퍼 💌</h5>
        <AllReceivedRollingPapers />
      </div>

      <ul className="rolling-paper">
        {rollingPapers.length > 0 ? (
          <>
            {rollingPapers.map((rollingPaper) => (
              <li key={rollingPaper.id} className="shadow-sm">
                <Link href={rollingPaper.link} className="f-center pl-2 pr-2">
                  <div className="name">{rollingPaper.name}</div>
                </Link>
              </li>
            ))}
          </>
        ) : (
          <li className="no-rolling-paper">받은 롤링페이퍼가 없습니다.</li>
        )}
      </ul>
    </div>
  )
}

export default ReceivedRollingPapers
