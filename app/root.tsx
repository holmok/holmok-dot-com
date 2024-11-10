import { NavigationProps } from './components/navigation'
import HtmlLayout from './components/html-layout'
import { Outlet, useNavigate } from '@remix-run/react'
import PageLayout, { PageLayoutProps } from './components/page-layout'

import resetStyle from '~/styles/reset.css?url'
import variablesStyle from '~/styles/variables.css?url'
import rootStyle from '~/styles/root.css?url'

export function links() {
  return [
    { rel: 'stylesheet', href: resetStyle },
    { rel: 'stylesheet', href: variablesStyle },
    { rel: 'stylesheet', href: rootStyle }
  ]
}

export default function App() {
  const navigate = useNavigate()

  const navigationProps: NavigationProps = {
    items: [
      { title: 'Home', url: '/' },
      { title: 'About', url: '/about' },
      { title: 'Utilities', url: '/utilities' }
    ],
    navigate: (url) => navigate(url)
  }

  const pageLayout: PageLayoutProps = {
    header: {
      navigation: navigationProps
    }
  }

  return (
    <HtmlLayout>
      <PageLayout {...pageLayout}>
        <Outlet />
      </PageLayout>
    </HtmlLayout>
  )
}
