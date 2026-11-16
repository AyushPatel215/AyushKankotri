'use client';

import { memo } from 'react';
import { Rise } from './RiseText';

/** Blessings of Maa Umiya, kuldevi of the Patel family, set on the page like the Ganesha welcome */
export const BlessingsSection = memo(function BlessingsSection() {
  return (
    <section id="blessings" className="mj-section safe-x">
      <div className="mj-text">
        <Rise>
          <p className="gw-invocation">॥ જય મા ઉમિયા ॥</p>
        </Rise>
        <Rise delay={150}>
          <h2 className="mj-title font-gu font-bold gold-text">મા ઉમિયાના આશીર્વાદ</h2>
        </Rise>
        <Rise delay={300}>
          <p className="mj-sub font-gu">
            કુળદેવી મા ઉમિયાના આશીર્વાદથી આ પવિત્ર બંધન પ્રેમ, વિશ્વાસ અને સમૃદ્ધિથી સદાય ભર્યું રહે.
          </p>
        </Rise>
      </div>
    </section>
  );
});
