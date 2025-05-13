export const metadata = {
  title: 'Üye Ol - İzorder',
  description: 'İzmir-Ordu Kültür ve Dayanışma Derneği Üyelik Formu',
};

export default function MembershipFormPage() {
  // Google Form embed URL (replace with actual URL)
  const googleFormUrl = "https://docs.google.com/forms/d/e/YOUR_FORM_ID/viewform?embedded=true";
  
  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold text-primary mb-6">Üyelik Başvuru Formu</h1>
      <p className="mb-6">
        Derneğimize üye olmak için lütfen aşağıdaki formu doldurunuz. Başvurunuz 
        yönetim kurulu tarafından değerlendirilecek ve tarafınıza bilgi verilecektir.
      </p>
      
      <div className="w-full bg-white p-2 rounded-lg shadow-md">
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
      </div>
    </div>
  );
} 