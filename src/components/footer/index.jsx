import {
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
} from "lucide-react";

function Footer() {
  return (
    <footer className="bg-gradient-to-r from-[#0b4f4a] via-[#1a756f] to-[#2a9b94] border-t border-slate-600 py-8 mt-16 text-white animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-4 mb-2">
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white transition-transform duration-300 hover:scale-110"
            >
              <Instagram size={24} />
            </a>
            <a
              href="https://www.twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white transition-transform duration-300 hover:scale-110"
            >
              <Twitter size={24} />
            </a>
            <a
              href="https://www.linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white transition-transform duration-300 hover:scale-110"
            >
              <Linkedin size={24} />
            </a>
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white transition-transform duration-300 hover:scale-110"
            >
              <Facebook size={24} />
            </a>
          </div>
          <p className="mb-2">Your trusted centralized medical report system</p>
          <p className="text-sm text-emerald-400">
            Secure • Reliable • Always Accessible
          </p>
          <div className="mt-4 pt-4 border-t border-slate-600 flex justify-center space-x-4">
            <span>© 2023 MedLock. All rights reserved.</span>
            <a 
              href="/privacy-policy" 
              className="hover:underline transition-all duration-300 text-white"
            >
              Privacy Policy
            </a>
            <a 
              href="/terms-of-service" 
              className="hover:underline transition-all duration-300 text-white"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;