import { HeaderContainer } from './styled'

import logoImg from '../../assets/logo.svg'
import Image from 'next/image'
import { Cart } from '../Cart'
import { useRouter } from 'next/router'

export function Header() {
  const { pathname } = useRouter()

  const showCartButton = pathname !== '/success'
  return (
    <HeaderContainer>
      <Image src={logoImg} alt="" />

      {showCartButton && <Cart />}
    </HeaderContainer>
  )
}
