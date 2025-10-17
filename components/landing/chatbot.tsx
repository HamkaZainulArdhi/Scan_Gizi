import { useEffect, useState } from 'react';
import { BotMessageSquare, CircleCheck } from 'lucide-react';
import { ChatSheet } from '@/app/components/partials/topbar/chat-sheet';
import { Alert, AlertIcon, AlertTitle } from '../ui/alert'; // pastikan path ini sesuai dengan struktur kamu
import { Button } from '../ui/button';

export default function Chatbot() {
  const [isVisible, setIsVisible] = useState(false);
  const [showAlert, setShowAlert] = useState(true);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <div className="fixed bottom-8 right-8 z-[99] flex flex-col items-end space-y-2">
      {/* Alert tampil di atas tombol chatbot */}
      {isVisible && showAlert && (
        <Alert
          variant="success"
          appearance="light"
          close={true}
          onClose={() => setShowAlert(false)} // hanya hilang kalau user klik close
          className="mb-2 shadow-md"
        >
          <AlertIcon>
            <CircleCheck />
          </AlertIcon>
         <AlertTitle>Perlu bantuan? AI GiziKita</AlertTitle>
        </Alert>
      )}

      {/* Tombol Chatbot */}
      {isVisible && (
        <div
          aria-label="chatbot"
          className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-md bg-primary text-white shadow-md transition duration-300 ease-in-out hover:bg-opacity-80 hover:shadow-signUp"
        >
          <ChatSheet
            trigger={
              <Button
                variant="primary"
                mode="icon"
                className="hover:bg-background hover:[&_svg]:text-primary transition"
              >
                <BotMessageSquare className="size-4.5!" />
              </Button>
            }
          />
        </div>
      )}
    </div>
  );
}
