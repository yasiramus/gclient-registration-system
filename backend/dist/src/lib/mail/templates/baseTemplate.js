"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.baseTemplate = baseTemplate;
function baseTemplate({ subject, content, }) {
    return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>
          body { font-family: Arial, sans-serif; background-color: #f9fafb; padding: 2rem; color: #111827; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; padding: 2rem;  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);}
          .footer { margin-top: 2rem; font-size: 0.875rem; color: #6b7280; }
          .btn {
          background-color: #1d4ed8;
          color: #ffffff;
          padding: 0.75rem 1.5rem;
          text-decoration: none;
          border-radius: 0.375rem;
          display: inline-block;
          margin-top: 1rem;
        }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>${subject}</h2>
          ${content}
          <div class="footer">If you didn't request this, you can safely ignore this email.</div>
        </div>
      </body>
    </html>
  `;
}
