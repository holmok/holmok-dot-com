import { useState } from 'react'
import { MouseEvent } from 'react'

export interface NavigationProps {
  navigate?: (url: string) => void
  items?: { title: string; url: string }[]
}

export default function Navigation(props: NavigationProps) {
  const {
    navigate,
    items = [
      { title: 'Home', url: '/' },
      { title: 'About', url: '/about' },
      { title: 'Contact', url: '/contact' },
      { title: 'Register', url: '/register' }
    ]
  } = props

  const [showMenu, setShowMenu] = useState(false)

  function handleMenuToggle(event: MouseEvent<HTMLAnchorElement>): void {
    event.preventDefault()
    setShowMenu(!showMenu)
  }

  function handleMenuItemClick(event: MouseEvent<HTMLAnchorElement>): void {
    if (navigate != null) {
      event.preventDefault()
      setShowMenu(false)
      navigate(event.currentTarget.pathname)
    }
  }

  return (
    <div className='nav'>
      <nav>
        <a className='menu-toggle' href='#nav' onClick={handleMenuToggle}>
          ☰
        </a>
        {showMenu && (
          <ul className='menu'>
            {items.map((item) => (
              <li key={item.url}>
                <a
                  data-url={item.url}
                  href={item.url}
                  onClick={handleMenuItemClick}
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        )}
      </nav>
    </div>
  )
}
