'use client';

import { Container } from '@/components/common/container';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <Container>
        <div className="flex flex-col md:flex-row justify-center md:justify-between items-center gap-3 py-5">
          <div className="flex order-2 md:order-1  gap-2 font-normal text-sm">
            <span className="text-muted-foreground">{currentYear} &copy;</span>
            <a
              href="https://keenthemes.com"
              target="_blank"
              className="text-secondary-foreground hover:text-primary"
            >
              Telkom University
            </a>
          </div>
          <nav className="flex order-1 md:order-2 gap-4 font-normal text-sm text-muted-foreground">
            <a
              href="https://docs.ultralytics.com/models/yolo11/"
              target="_blank"
              className="hover:text-primary"
            >
              YOLO
            </a>
            <a
              href="https://ai.google.dev/gemini-api/docs"
              target="_blank"
              className="hover:text-primary"
            >
              LLM
            </a>
            <a
              href="https://www.bgn.go.id/"
              target="_blank"
              className="hover:text-primary"
            >
              Support
            </a>
            <a
              href="https://hamkacv.vercel.app/"
              target="_blank"
              className="hover:text-primary"
            >
              Developer
            </a>
          </nav>
        </div>
      </Container>
    </footer>
  );
}
