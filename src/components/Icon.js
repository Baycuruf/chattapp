import React from 'react'
import SVG from 'react-inlinesvg/esm'

function Icon({name, size=16 , ...props}) {
  return (
    <SVG 
      src={`${process.env.PUBLIC_URL}/icons/${name}.svg`}
      width={size}
      height={size}
      {...props}
      />
  )
}

export default Icon
