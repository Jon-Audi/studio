// src/components/icons/delaware-fence-solutions-logo-icon.tsx
export const DelawareFenceSolutionsLogoIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="150"
    height="50"
    viewBox="0 0 175 50" // Adjusted viewBox height to fit content better
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    {/* Horizontal rails - Adjusted y positions and height to be thinner */}
    <rect x="0" y="28" width="175" height="3"/>
    <rect x="0" y="38" width="175" height="3"/>

    {/* Pickets (decreasing height from left to right) */}
    {/* Picket 1 (tallest) */}
    <rect x="5" y="5" width="10" height="40"/>
    <polygon points="5,5 15,5 10,0"/>
    {/* Picket 2 */}
    <rect x="20" y="7" width="10" height="38"/>
    <polygon points="20,7 30,7 25,2"/>
    {/* Picket 3 */}
    <rect x="35" y="9" width="10" height="36"/>
    <polygon points="35,9 45,9 40,4"/>
    {/* Picket 4 */}
    <rect x="50" y="11" width="10" height="34"/>
    <polygon points="50,11 60,11 55,6"/>
    {/* Picket 5 */}
    <rect x="65" y="13" width="10" height="32"/>
    <polygon points="65,13 75,13 70,8"/>
    {/* Picket 6 */}
    <rect x="80" y="15" width="10" height="30"/>
    <polygon points="80,15 90,15 85,10"/>
    {/* Picket 7 */}
    <rect x="95" y="17" width="10" height="28"/>
    <polygon points="95,17 105,17 100,12"/>
    {/* Picket 8 */}
    <rect x="110" y="19" width="10" height="26"/>
    <polygon points="110,19 120,19 115,14"/>
    {/* Picket 9 */}
    <rect x="125" y="21" width="10" height="24"/>
    <polygon points="125,21 135,21 130,16"/>
    {/* Picket 10 */}
    <rect x="140" y="23" width="10" height="22"/>
    <polygon points="140,23 150,23 145,18"/>
    {/* Picket 11 (shortest) */}
    <rect x="155" y="25" width="10" height="20"/>
    <polygon points="155,25 165,25 160,20"/>
  </svg>
);
