'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/utils/firebase/client';

export default function MembershipFormPage() {
  const [googleFormUrl, setGoogleFormUrl] = useState<string | null>(null);
  useEffect(() => {
    async function fetchFormUrl() {
      const ref = doc(db, 'contact_info', 'main');
      const snap = await getDoc(ref);
      if (snap.exists() && snap.data().googleFormUrl) {
        setGoogleFormUrl(snap.data().googleFormUrl);
      } else {
        setGoogleFormUrl("https://docs.google.com/forms/d/e/YOUR_FORM_ID/viewform?embedded=true");
      }
    }
    fetchFormUrl();
  }, []);

  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold text-primary mb-6">Üyelik Başvuru Formu</h1>
      <p className="mb-6">
        Derneğimize üye olmak için lütfen aşağıdaki formu doldurunuz. Başvurunuz 
        yönetim kurulu tarafından değerlendirilecek ve tarafınıza bilgi verilecektir.
      </p>
      
      <div className="w-full bg-white p-2 rounded-lg shadow-md">
        {googleFormUrl && (
          <iframe
            src={googleFormUrl}
            width="100%"
            height="800"
            frameBorder="0"
            marginHeight={0}
            marginWidth={0}
            className="w-full"
          >
            Yükleniyor…
          </iframe>
        )}
      </div>
    </div>
  );
}