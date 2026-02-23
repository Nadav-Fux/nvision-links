const svgContent = `<svg width="SIZE" height="SIZE" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="8" r="2.5" fill="#06b6d4" opacity="0.9"><animate attributeName="r" values="2.5;2.8;2.5" dur="3s" repeatCount="indefinite"/></circle><path d="M8 16.5c0-2.2 1.8-4 4-4s4 1.8 4 4" stroke="#06b6d4" stroke-width="1.5" stroke-linecap="round" opacity="0.9"/><circle cx="5" cy="10" r="1.8" fill="#8b5cf6" opacity="0.7"><animate attributeName="opacity" values="0.7;0.9;0.7" dur="2.5s" repeatCount="indefinite"/></circle><path d="M2 17c0-1.7 1.3-3 3-3s3 1.3 3 3" stroke="#8b5cf6" stroke-width="1.3" stroke-linecap="round" opacity="0.6"/><circle cx="19" cy="10" r="1.8" fill="#ec4899" opacity="0.7"><animate attributeName="opacity" values="0.7;0.9;0.7" dur="2.8s" repeatCount="indefinite"/></circle><path d="M16 17c0-1.7 1.3-3 3-3s3 1.3 3 3" stroke="#ec4899" stroke-width="1.3" stroke-linecap="round" opacity="0.6"/><line x1="8" y1="11" x2="10" y2="9" stroke="#06b6d4" stroke-width="0.5" opacity="0.3"><animate attributeName="opacity" values="0.3;0.6;0.3" dur="2s" repeatCount="indefinite"/></line><line x1="16" y1="11" x2="14" y2="9" stroke="#ec4899" stroke-width="0.5" opacity="0.3"><animate attributeName="opacity" values="0.3;0.6;0.3" dur="2.3s" repeatCount="indefinite"/></line></svg>`;

export const CommunityIcon = ({ size = 24 }: { size?: number }) => (
  <span
    className="inline-block"
    style={{ width: size, height: size }}
    dangerouslySetInnerHTML={{ __html: svgContent.replace(/SIZE/g, String(size)) }}
  />
);
