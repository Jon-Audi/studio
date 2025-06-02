export const LogoIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
    <line x1="12" y1="22" x2="12" y2="17"></line>
    <line x1="20" y1="12" x2="20" y2="7"></line>
    <line x1="4" y1="12" x2="4" y2="7"></line>
  </svg>
);
