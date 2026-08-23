/**
 * The privacy policy body, rendered by both `/privacy-policy` (canonical) and
 * `/privacy` (the URL agents conventionally probe). One source, so the two can
 * never drift; `/privacy` declares `/privacy-policy` as its canonical.
 */
export function PrivacyContent() {
  return (
    <>
      <p className="mb-4">Last updated: June 16, 2026</p>

      <p className="mb-4">
        This website (<strong>arpitkhandelwal.com</strong>) is a personal portfolio site. This page
        explains what is collected when you visit and how you control it.
      </p>

      <h2 className="mb-2 mt-8 text-lg font-semibold">Analytics and cookies</h2>
      <p className="mb-4">
        With your consent, this site loads <strong>Google Tag Manager</strong> and{" "}
        <strong>Microsoft Clarity</strong>. Clarity records anonymized session analytics (page
        interactions, heatmaps, and session replay) and, together with Google Tag Manager, sets
        cookies such as <code>_clck</code> and <code>_clsk</code>. These tools run only after you
        choose &ldquo;Accept&rdquo; in the consent banner. If you choose &ldquo;Decline,&rdquo; no
        analytics scripts are loaded and no analytics cookies are set. Your choice is stored locally
        in your browser so you are not asked again; clearing site data resets it.
      </p>

      <h2 className="mb-2 mt-8 text-lg font-semibold">Contact form</h2>
      <p className="mb-4">
        If you submit the contact form, the name, email, and message you enter are delivered to me
        as a private Telegram notification so I can reply. If you email directly, your message and
        address reach my inbox. This information is used only to respond to you.
      </p>

      <h2 className="mb-2 mt-8 text-lg font-semibold">Hosting</h2>
      <p className="mb-4">
        The site is hosted on Vercel, which may collect standard server logs (including IP address
        and browser information) as part of delivering the site. See Vercel&rsquo;s privacy policy
        for details.
      </p>

      <h2 className="mb-2 mt-8 text-lg font-semibold">Contact</h2>
      <p>
        Questions about this policy? Email{" "}
        <a className="font-semibold underline" href="mailto:ak@arpitkhandelwal.com">
          ak@arpitkhandelwal.com
        </a>
        .
      </p>
    </>
  );
}
