import {
  CONTACT_EMAIL,
  PHONE_DISPLAY,
  PHONE_TEL,
  SOCIAL_LINKS,
  isContactEmailSet,
} from "@/lib/site";

export function PhoneLink({ className = "" }: { className?: string }) {
  return (
    <a href={`tel:${PHONE_TEL}`} className={className}>
      {PHONE_DISPLAY}
    </a>
  );
}

export function ContactEmail({ className = "" }: { className?: string }) {
  if (!isContactEmailSet()) {
    return <span className={className}>Email not published yet</span>;
  }
  return (
    <a href={`mailto:${CONTACT_EMAIL}`} className={className}>
      {CONTACT_EMAIL}
    </a>
  );
}

function SocialIcon({ name }: { name: "Facebook" | "Instagram" | "YouTube" }) {
  if (name === "Facebook") {
    return (
      <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true" fill="currentColor">
        <path d="M14 9h3V6h-3c-1.7 0-3 1.3-3 3v2H8v3h3v7h3v-7h3l1-3h-4V9c0-.6.4-1 1-1z" />
      </svg>
    );
  }
  if (name === "Instagram") {
    return (
      <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="4" y="4" width="16" height="16" rx="4" />
        <circle cx="12" cy="12" r="3.5" />
        <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true" fill="currentColor">
      <path d="M23 12.2s0-3.2-.4-4.6c-.2-.9-.9-1.6-1.8-1.8C19.2 5.4 12 5.4 12 5.4s-7.2 0-8.8.4c-.9.2-1.6.9-1.8 1.8C1 9 1 12.2 1 12.2s0 3.2.4 4.6c.2.9.9 1.6 1.8 1.8 1.6.4 8.8.4 8.8.4s7.2 0 8.8-.4c.9-.2 1.6-.9 1.8-1.8.4-1.4.4-4.6.4-4.6zM9.8 15.5v-6.6l6.2 3.3-6.2 3.3z" />
    </svg>
  );
}

export function SocialLinks({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
      {SOCIAL_LINKS.map((link) => {
        const content = (
          <>
            <SocialIcon name={link.name} />
            <span>{link.name}</span>
          </>
        );
        if (!link.url) {
          return (
            <span
              key={link.name}
              className="inline-flex items-center gap-1.5 opacity-70"
              title={`${link.name} link not published yet`}
            >
              {content}
            </span>
          );
        }
        return (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
          >
            {content}
          </a>
        );
      })}
    </div>
  );
}
