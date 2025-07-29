import React from "react"

const DarkBlueRadialGradient = () => {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-0 -z-[1] hidden dark:block"
        style={{
          background: "radial-gradient(125% 125% at 50% 90%, #000000 40%, #010133 100%)",
        }}
      />

      <div
        className="pointer-events-none absolute inset-0 -z-[1] block dark:hidden"
        style={{
          background: "radial-gradient(125% 125% at 50% 90%, #fafafa 45%, #6365f1a0 100%)",
        }}
      />
    </>
  )
}

export { DarkBlueRadialGradient }
