import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'
import NxTextAnimation from './components/NxTextAnimation'

const config: DocsThemeConfig = {
  logo: <span>My Project</span>,
  project: {
    link: 'https://github.com/shuding/nextra-docs-template',
  },
  chat: {
    link: 'https://discord.com',
  },
  docsRepositoryBase: 'https://github.com/shuding/nextra-docs-template',
  footer: {
    text: 'Nextra Docs Template',
  },
  components: {
    NxTextAnimation
  }
}

export default config
