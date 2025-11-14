
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { FacebookIcon, TelegramIcon, TwitterIcon } from "@/components/social-icons";

const faqItems = [
  {
    question: "What is kisskh?",
    answer: "kisskh is a free streaming website that allows you to watch thousands of movies and TV shows online in high quality for free. We are a demo application and do not host any files on our server. All content is provided by non-affiliated third parties."
  },
  {
    question: "Is kisskh free?",
    answer: "Yes, kisskh is completely free. You don't need to pay or register to watch movies and TV shows."
  },
  {
    question: "What should I do if I can't play a video?",
    answer: "There might be several reasons for this. First, check your internet connection. If your connection is fine, try clearing your browser's cache and cookies. You can also try switching to a different server from the list provided below the video player."
  },
  {
    question: "How can I request a movie or TV show?",
    answer: "We are constantly adding new content to our library. However, as a demo application, we do not currently have a feature to request specific titles. The content is automatically sourced from our third-party provider."
  },
  {
    question: "Is kisskh safe?",
    answer: "Yes, using kisskh is safe. We do not require any personal information for you to use the site, and we do not host any files. The embedded content is from reputable third-party sources."
  }
];

const FACEBOOK_URL = "https://facebook.com";
const TWITTER_URL = "https://x.com";
const TELEGRAM_URL = "https://telegram.org";

export default function FAQPage() {
  return (
    <div className="container py-8 max-w-4xl mx-auto text-foreground">
      <h1 className="text-3xl font-bold mb-6 text-center">Frequently Asked Questions</h1>
      <Accordion type="single" collapsible className="w-full">
        {faqItems.map((item, index) => (
          <AccordionItem value={`item-${index}`} key={index}>
            <AccordionTrigger className="text-lg font-semibold text-left hover:no-underline">{item.question}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
       <div className="text-center mt-16 pt-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">Find us on</h2>
            <div className="flex items-center justify-center space-x-6">
                <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                    <FacebookIcon className="w-8 h-8"/>
                    <span className="font-semibold">Facebook</span>
                </a>
                <a href={TWITTER_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                    <TwitterIcon className="w-7 h-7"/>
                    <span className="font-semibold">Twitter (X)</span>
                </a>
                <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                    <TelegramIcon className="w-7 h-7"/>
                    <span className="font-semibold">Telegram</span>
                </a>
            </div>
        </div>
    </div>
  );
}
