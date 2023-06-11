export default async function request(path: string) {
  try {
    const data = await fetch(`${process.env.API_URL}/${path}`)

    if (!data.ok) {
      throw new Error("데이터 fetch 에러 발생")
    }

    return await data.json()
  } catch (error) {
    // 무시
  }
}
