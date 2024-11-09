import { useNavigate } from '@remix-run/react'
import { MouseEvent } from 'react'

export interface BreadcrumbProps {
  crumbs: {
    href?: string
    label: string
  }[]
}

export default function Breadcrumb(props: BreadcrumbProps) {
  const navigate = useNavigate()
  function handleCrumbClick(event: MouseEvent<HTMLAnchorElement>): void {
    event.preventDefault()
    const href = event.currentTarget.getAttribute('href')
    if (href != null) navigate(href)
  }
  return (
    <div className='breadcrumb'>
      {props.crumbs.map((crumb, index) => {
        return (
          <>
            {index > 0 && ' » '}
            <span key={index}>
              {crumb.href != null && (
                <a href={crumb.href} onClick={handleCrumbClick}>
                  {crumb.label}
                </a>
              )}
              {crumb.href == null && (
                <span className='current'>{crumb.label}</span>
              )}
            </span>
          </>
        )
      })}
    </div>
  )
}
