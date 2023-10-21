type TProps = {
  target: HTMLElement | null
}

// TODO: 렌더링 성능에 영향을 미칠 수 있음. 확인 필요.
const FocusDots = ({target}: TProps) => {
  if (!target) {
    return <></>
  }

  const startX = parseInt(target.style.left)
  const startY = parseInt(target.style.top)

  const endX = startX + parseInt(target.style.width)
  const endY = startY + parseInt(target.style.height)

  const middleX = (startX + endX) / 2
  const middleY = (startY + endY) / 2

  return (
    <>
      <div
        className="dot left-top"
        style={{left: startX - 2, top: startY - 3}}
      />
      <div className="dot top" style={{left: middleX - 3, top: startY - 3}} />
      <div
        className="dot right-top"
        style={{left: endX - 4, top: startY - 3}}
      />
      <div className="dot right" style={{left: endX - 4, top: middleY - 4}} />

      <div className="dot right-down" style={{left: endX - 4, top: endY - 4}} />
      <div className="dot down" style={{left: middleX - 3, top: endY - 4}} />
      <div
        className="dot left-down"
        style={{left: startX - 2, top: endY - 4}}
      />
      <div className="dot left" style={{left: startX - 2, top: middleY - 4}} />
    </>
  )
}

export default FocusDots
