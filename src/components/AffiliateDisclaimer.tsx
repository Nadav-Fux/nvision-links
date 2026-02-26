import { Gift, Heart } from 'lucide-react';

interface AffiliateDisclaimerProps {
  visible: boolean;
  customText?: string;
}

export const AffiliateDisclaimer = ({ visible, customText }: AffiliateDisclaimerProps) => {
  const defaultText = 'חלק מהכלים כאן כוללים קישור הפניה (חבר מביא חבר). אם תירשמו דרכם, תקבלו הטבה מיוחדת וגם תתמכו בפעילות הקהילה שלנו. כלים עם הטבה מסומנים ב-🎁';

  return (
    <div data-ev-id="ev_0c04da0de2"
    className={`my-8 transition-[opacity,transform] duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>

      <div data-ev-id="ev_2276bfb293"
      role="note"
      aria-label="הודעת שקיפות על קישורי שותפים"
      className="relative flex flex-col gap-3 px-4 py-3.5 rounded-xl bg-amber-500/[0.04] border border-amber-500/10">

        <div data-ev-id="ev_f42d80a413"
        className="absolute top-0 right-[10%] left-[10%] h-px bg-gradient-to-r from-transparent via-amber-400/20 to-transparent"
        aria-hidden="true" />


        <div data-ev-id="ev_94e0254572" className="flex items-start gap-3">
          <Gift className="w-4 h-4 text-amber-400/70 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <p data-ev-id="ev_f8a70d03dd" className="text-white/60 text-sm leading-relaxed">
            <span data-ev-id="ev_5df66b1777" className="text-white/70 font-medium">שקיפות מלאה</span>{' — '}
            {customText || defaultText}
            {' '}לעולם לא תשלמו יותר אם תשתמשו בקישור, לרוב אפילו תקבלו הטבה בעצמכם{' '}
            <Heart className="inline w-3 h-3 text-red-400/50 -mt-0.5" aria-hidden="true" />
          </p>
        </div>
      </div>
    </div>);

};