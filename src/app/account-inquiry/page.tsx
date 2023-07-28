import Image from "next/image"
import {home} from "@/assets/images" // TODO: 슬로건 사진으로 교체
import {CustomerService, EmailInput} from "@/components/account-inquiry"

const AccountInquiry = () => {
  return (
    <div className="account-inquiry root-wrapper">
      <header className="header">
        <Image src={home} alt="슬로건" loading="eager" height={60} />
      </header>

      <main className="main f-center">
        <EmailInput />
        <CustomerService />
      </main>
    </div>
  )
}

export default AccountInquiry
