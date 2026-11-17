import React, { forwardRef } from "react";

/*
 * The logo: two mirrored halves with a narrow gap down the middle. Geometry
 * traced from the original 512px mark (98% pixel match), in its own units:
 * each stroke is 61 wide and the gap is 10.
 *
 * The halves are separate groups so they can be animated apart and snapped
 * back together (see lib/snap.js). `seam` adds the strip in the gap that
 * flashes when they land.
 */
const ARCH = "M62 339V212A115 115 0 0 1 177 97H251V158H177A54 54 0 0 0 123 212V339Z";
const FOOT = "M190 221H251V297A112 112 0 0 1 139 409H63V348H139A51 51 0 0 0 190 297Z";

const Mark = forwardRef(function Mark({ className = "", label, seam = false, ...rest }, ref) {
  return (
    <svg
      ref={ref}
      viewBox="52 87 408 332"
      className={`mark ${className}`}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
      {...rest}
    >
      <g className="mark__half mark__half--l">
        <path d={ARCH} />
        <path d={FOOT} />
      </g>
      <g className="mark__half mark__half--r">
        <g transform="translate(512 0) scale(-1 1)">
          <path d={ARCH} />
          <path d={FOOT} />
        </g>
      </g>
      {seam && <rect className="mark__seam" x="251" y="90" width="10" height="326" />}
    </svg>
  );
});

export default Mark;
