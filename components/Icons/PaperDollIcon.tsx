import { SVGProps } from 'react';

interface IProps extends SVGProps<SVGSVGElement> {
  // Equipment slot key to highlight (head, torso, hand, ...).
  activeSlot?: string;
}

// Each zone carries `data-zone`; the active one gets `data-active="true"` so
// the owning stylesheet can highlight it without this icon knowing any class.
const PaperDollIcon = ({ activeSlot, ...props }: IProps) => {
  const zone = (slot: string) => ({
    'data-zone': slot,
    'data-active': activeSlot === slot ? 'true' : 'false',
  });

  return (
    <svg
      viewBox="0 0 100 210"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
      strokeLinecap="round"
      aria-hidden="true"
      {...props}
    >
      <circle {...zone('head')} cx="50" cy="24" r="15" />
      <path
        {...zone('torso')}
        d="M30 46 Q50 40 70 46 L73 106 Q50 112 27 106 Z"
      />
      <path {...zone('hand')} d="M28 50 L14 100 L20 102 L32 64 Z" />
      <circle {...zone('hand')} cx="16" cy="110" r="6" />
      <path {...zone('offhand')} d="M72 50 L86 100 L80 102 L68 64 Z" />
      <rect {...zone('offhand')} x="78" y="104" width="16" height="20" rx="3" />
      <path
        {...zone('legs')}
        d="M31 110 L34 180 L47 180 L50 122 L53 180 L66 180 L69 110 Q50 116 31 110 Z"
      />
      <path
        {...zone('feet')}
        d="M33 184 h14 v12 h-19 z M53 184 h14 l5 12 h-19 z"
      />
      <circle {...zone('accessory1')} cx="50" cy="54" r="4" />
      <circle {...zone('accessory2')} cx="11" cy="116" r="3" />
    </svg>
  );
};

export default PaperDollIcon;
