'use client';

type FooterNoteProps = {
  note?: string;
}

export function FooterNote({ note }: FooterNoteProps) {
  return (
    <div className="mt-8 border-t border-gray-200 pt-4">
      <p className="text-sm text-gray-600 text-center">
        {note || 'Veuillez trouver ci-joint notre devis pour votre projet. Il est valable 30 jours.'}
      </p>
    </div>
  );
}
