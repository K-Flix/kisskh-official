
export default function PrivacyPolicyPage() {
  return (
    <div className="container py-8 max-w-4xl mx-auto text-foreground">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <div className="space-y-6 text-muted-foreground prose prose-invert">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2 className="text-2xl font-semibold text-foreground pt-4 border-b pb-2">1. Introduction</h2>
        <p>Welcome to kisskh. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.</p>

        <h2 className="text-2xl font-semibold text-foreground pt-4 border-b pb-2">2. Information We Collect</h2>
        <p>We may collect information about you in a variety of ways. The information we may collect on the Site includes:</p>
        <ul className="list-disc list-inside space-y-2 pl-4">
            <li><strong>Personal Data:</strong> We do not collect any personal data as this is a demo application.</li>
            <li><strong>Derivative Data:</strong> Information our servers automatically collect when you access the Site, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Site.</li>
             <li><strong>Local Storage:</strong> We use your browser's local storage to save your watchlist. This data is stored only on your device and is not transmitted to our servers.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-foreground pt-4 border-b pb-2">3. Use of Your Information</h2>
        <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:</p>
         <ul className="list-disc list-inside space-y-2 pl-4">
            <li>Enhance and improve the user experience.</li>
            <li>Monitor and analyze usage and trends to improve your experience with the Site.</li>
            <li>Maintain the functionality of your personal watchlist.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-foreground pt-4 border-b pb-2">4. Disclaimer</h2>
        <p>kisskh does not host any files on its server. All content is provided by non-affiliated third parties.</p>

        <h2 className="text-2xl font-semibold text-foreground pt-4 border-b pb-2">5. Changes to This Privacy Policy</h2>
        <p>We may update this Privacy Policy from time to time in order to reflect, for example, changes to our practices or for other operational, legal, or regulatory reasons.</p>

        <h2 className="text-2xl font-semibold text-foreground pt-4 border-b pb-2">6. Contact Us</h2>
        <p>If you have questions or comments about this Privacy Policy, please contact us at: contact@kisskh.com</p>
      </div>
    </div>
  );
}
