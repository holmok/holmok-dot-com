import Navigation, { NavigationProps } from './navigation'
import { MouseEvent } from 'react'

export interface HeaderProps {
  navigation?: NavigationProps
}

export default function Header(props: HeaderProps) {
  const { navigation } = props
  function handleScrollUp(event: MouseEvent<HTMLAnchorElement>): void {
    event.preventDefault()
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <header onDoubleClick={handleScrollUp}>
      <div className='wrapper'>
        <div className='title'>holmok.com</div>
        <Navigation {...navigation} />
      </div>
    </header>
  )
}
