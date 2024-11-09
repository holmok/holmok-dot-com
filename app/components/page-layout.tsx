import Header, { HeaderProps } from './header'
import Footer from './footer'

export interface PageLayoutProps {
  header?: HeaderProps
}

export default function PageLayout(
  props: PageLayoutProps & { children: React.ReactNode }
) {
  const { children, header } = props
  return (
    <div className='layout'>
      <Header {...header} />
      <div className='content'>{children}</div>
      <Footer />
    </div>
  )
}
