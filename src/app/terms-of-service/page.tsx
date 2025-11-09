
export default function TermsOfServicePage() {
  return (
    <div className="container py-8 max-w-4xl mx-auto text-foreground">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <div className="space-y-6 text-muted-foreground prose prose-invert">
        <p>Last updated: {new Date().toLocaleDateString()}</p>

        <h2 className="text-2xl font-semibold text-foreground pt-4 border-b pb-2">1. Agreement to Terms</h2>
        <p>By using our website, you agree to be bound by these Terms of Service. If you do not agree to these Terms, do not use the service. This is a demo application and should not be used for commercial purposes.</p>

        <h2 className="text-2xl font-semibold text-foreground pt-4 border-b pb-2">2. Description of Service</h2>
        <p>kisskh provides users with access to a rich collection of resources, including various communications tools, search services, and personalized content through its network of properties which may be accessed through any various medium or device now known or hereafter developed.</p>

        <h2 className="text-2xl font-semibold text-foreground pt-4 border-b pb-2">3. Content Disclaimer</h2>
        <p>You understand that all information, data, text, software, music, sound, photographs, graphics, video, messages, tags, or other materials ("Content"), whether publicly posted or privately transmitted, are the sole responsibility of the person from whom such Content originated. This means that you, and not kisskh, are entirely responsible for all Content that you upload, post, email, transmit, or otherwise make available via the Service.</p>
        <p>kisskh does not host any content on its servers. All media is embedded from third-party sources. We do not control the Content posted via the Service and, as such, do not guarantee the accuracy, integrity, or quality of such Content.</p>

        <h2 className="text-2xl font-semibold text-foreground pt-4 border-b pb-2">4. User Conduct</h2>
        <p>You agree to not use the Service to:</p>
        <ul className="list-disc list-inside space-y-2 pl-4">
            <li>upload, post, email, transmit, or otherwise make available any Content that is unlawful, harmful, threatening, abusive, harassing, tortious, defamatory, vulgar, obscene, libelous, invasive of another's privacy, hateful, or racially, ethnically, or otherwise objectionable;</li>
            <li>harm minors in any way;</li>
            <li>impersonate any person or entity, including, but not limited to, a kisskh official, forum leader, guide or host, or falsely state or otherwise misrepresent your affiliation with a person or entity;</li>
        </ul>

        <h2 className="text-2xl font-semibold text-foreground pt-4 border-b pb-2">5. Modifications to Service</h2>
        <p>kisskh reserves the right at any time and from time to time to modify or discontinue, temporarily or permanently, the Service (or any part thereof) with or without notice. You agree that kisskh shall not be liable to you or to any third party for any modification, suspension, or discontinuance of the Service.</p>
      </div>
    </div>
  );
}
