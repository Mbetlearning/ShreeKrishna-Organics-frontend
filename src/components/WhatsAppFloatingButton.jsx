import React from "react";

export default function WhatsAppFloatingButton() {
  // तुमचा WhatsApp Business नंबर टाका
  // Country code 91 वापरा. + किंवा spaces नकोत.
  const phoneNumber = "919011087310";

  const message =
    "Hello ShreeKrishna Organics, I would like to enquire about your products.";

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message
  )}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Send Enquiry on WhatsApp"
      className="
        fixed bottom-6 right-6 z-[9999]
        flex items-center gap-3
        rounded-full
        bg-[#25D366]
        px-5 py-3
        text-white
        shadow-[0_6px_24px_rgba(0,0,0,0.25)]
        transition-all duration-300
        hover:scale-105
        hover:bg-[#20BD5A]
      "
    >
      {/* WhatsApp Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="27"
        height="27"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M20.52 3.48A11.87 11.87 0 0 0 12.05 0C5.48 0 .13 5.35.12 11.93c0 2.1.55 4.16 1.6 5.98L0 24l6.25-1.64a11.9 11.9 0 0 0 5.8 1.48h.01c6.57 0 11.92-5.35 11.94-11.93a11.85 11.85 0 0 0-3.48-8.43ZM12.06 21.8a9.86 9.86 0 0 1-5.03-1.38l-.36-.21-3.73.98.99-3.63-.24-.37a9.9 9.9 0 0 1-1.52-5.26c0-5.45 4.44-9.89 9.9-9.89a9.84 9.84 0 0 1 7 2.9 9.83 9.83 0 0 1 2.89 7c-.01 5.45-4.45 9.88-9.9 9.88Zm5.43-7.41c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.21 5.09 4.5.71.31 1.27.49 1.7.63.72.23 1.37.2 1.89.12.58-.09 1.76-.72 2.01-1.41.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z" />
      </svg>

      <span className="whitespace-nowrap text-sm font-bold">
        Send Enquiry
      </span>
    </a>
  );
}