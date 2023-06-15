export async function get(path: string) {
  try {
    const data = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api${path}`)

    if (!data.ok) {
      throw new Error("데이터 fetch 에러 발생")
    }

    return await data.json()
  } catch (error) {
    // 무시
  }
}

export async function post(path: string, body: Object) {
  try {
    const data = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api${path}`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "post",
      body: JSON.stringify(body),
    })

    if (!data.ok) {
      throw new Error("데이터 fetch 에러 발생")
    }

    return await data.json()
  } catch (error) {
    // 무시
  }
}
