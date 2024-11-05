# POC: Webcomponents styled with UnoCSS 

Trying out pure UnoCSS approach to custom-elements, doing everything build time, generating a free standing web components that has everything it needs with a minimum of css. 

This thing scrapes each component for used classes, generate a component specific cssfor each, injects this into a style block inside shadowdom prefixed by a stripped down shadow-reset. This generates a freestanding .js that could be served and used with or without UnoCss running in lightDom. 

## Install and usage

npm i
npm start

components in the src/components structure are regenerated into the dist/components structure.
