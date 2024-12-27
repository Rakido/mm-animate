import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'
import NxTextAnimation from './components/NxTextAnimation'

const config: DocsThemeConfig = {
  logo: <span>MM - Animate</span>,
  project: {
    link: 'https://github.com/Rakido/mm-animate',
  },
  docsRepositoryBase: 'https://github.com/Rakido/mm-animate',
  footer: {
    text: 'MM - Animate',
  },
  components: {
    NxTextAnimation
  }
}

export default config
