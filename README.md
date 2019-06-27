# atomic-generator-react

Renders react components as static html markup. One CSS file and one JS file are generated which contain all the styles and scripts.

First:

    yarn install    
Serves the playground (components/playground/playground):

    yarn dev
Builds a static pattern library under dist/atomic:

    yarn build

Production build:

    yarn build:prod

### Motivation

React with [styled-components](https://www.styled-components.com/) is fine if you want to build a dynamic web app. With frameworks like [Next.js](https://nextjs.org/) or [GatsbyJS](https://www.gatsbyjs.org/) you can build static pages, too.

But I needed a tool which makes it possible to deliver single React components as static HTML from a CMS as individual building blocks. Furthermore I liked the CSS in JS approach from styled-components but the class names in my case needed to be fixed and not hashed.

### How it works

atomic-generator-react consists of three parts:

#### 1. Pattern Library generator

The atomic-renderer script with the package under libs/atomic-renderer creates a static Pattern Library that also shows the HTML markup of the React components. These components are defined in atomic.json files which works a little bit like the stories files from [Storybook](https://github.com/storybooks/storybook).



### Examples

TBD


