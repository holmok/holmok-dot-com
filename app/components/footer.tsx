import { MouseEvent } from 'react'

export interface FooterProps {}

export default function Footer(props: FooterProps) {
  function handleScrollUp(event: MouseEvent<HTMLAnchorElement>): void {
    event.preventDefault()
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <footer>
      <div className='wrapper'>
        <div className='copy'>©2024 christopher holmok</div>
        <div className='links'>
          <a href='#top' onClick={handleScrollUp}>
            back to top ↑
          </a>
        </div>
      </div>
    </footer>
  )
}
