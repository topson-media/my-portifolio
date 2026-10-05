import React from 'react';

interface WhatsAppIconProps {
  className?: string;
  size?: number;
}

/**
 * Official WhatsApp Brand Icon with accurate speech-bubble and telephone receiver vector
 */
export const WhatsAppIcon: React.FC<WhatsAppIconProps> = ({
  className = 'w-5 h-5 fill-white',
  size,
}) => {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.983.538 1.848.814 2.791.814 3.182 0 5.768-2.587 5.769-5.766.001-3.182-2.585-5.8-5.77-5.8zm3.385 8.214c-.141.398-.718.73-1.009.774-.282.043-.645.068-1.047-.061-.403-.129-.929-.304-1.603-.601-1.396-.615-2.3-2.029-2.37-2.122-.07-.093-.568-.756-.568-1.442 0-.685.358-1.022.486-1.163.128-.141.28-.176.374-.176.094 0 .188.001.27.006.088.005.205-.033.32.245.118.283.403.985.438 1.057.036.071.059.155.012.248-.047.094-.07.153-.14.236-.07.082-.149.183-.212.246-.071.07-.145.146-.062.289.083.142.368.608.79 0.984.544.485 1.003.636 1.145.706.142.071.225.059.309-.035.083-.094.356-.414.451-.556.094-.141.189-.118.318-.071.129.047.82.386.961.457.142.07.236.106.271.165.035.059.035.341-.106.739zM12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.66 1.434 5.176L2 22l4.957-1.399C8.423 21.493 10.155 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" />
    </svg>
  );
};

/**
 * Reusable full-color WhatsApp button / badge container
 */
export const WhatsAppBrandBadge: React.FC<{
  className?: string;
  iconClassName?: string;
}> = ({ className = 'w-10 h-10 rounded-xl', iconClassName = 'w-5 h-5 fill-white' }) => {
  return (
    <div
      className={`${className} bg-[#25D366] flex items-center justify-center text-white shadow-sm shadow-[#25D366]/30 transition-transform`}
    >
      <WhatsAppIcon className={iconClassName} />
    </div>
  );
};
