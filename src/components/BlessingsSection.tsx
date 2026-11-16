'use client';

import { memo } from 'react';
import { Diya, Mandala, Temple } from './Decorations';
import { SectionTitle } from './SectionTitle';
import { Rise, RiseText } from './RiseText';

/** Blessings of Maa Umiya — kuldevi of the Patel family */
export const BlessingsSection = memo(function BlessingsSection() {
  return (
    <section id="blessings" className="section safe-x overflow-hidden">
      <Mandala
        size={460}
        className="spin-slow absolute left-1/2 top-[22%] -ml-[230px] -mt-[230px] pointer-events-none"
        opacity={0.1}
      />
      <div className="relative max-w-md mx-auto text-center">
        <Rise className="flex items-end justify-center gap-4 mb-6">
          <Diya className="mb-1" />
          <Temple size={140} />
          <Diya className="mb-1" />
        </Rise>

        <SectionTitle title="મા ઉમિયાના આશીર્વાદ" subtitle="અમારાં કુળદેવી" />

        <RiseText
          text="કુળદેવી મા ઉમિયાના આશીર્વાદથી આ પવિત્ર બંધન પ્રેમ, વિશ્વાસ અને સમૃદ્ધિથી સદાય ભર્યું રહે."
          className="font-gu text-cocoa/90 text-gu body-text"
          step={55}
        />

       
      </div>
    </section>
  );
});
