import "./404.css";

export default function NotFoundPage() {
  return (
    <main className='notfound-container'>
      <h1 className='notfound-title'>404</h1>
      <h2 className='notfound-subtitle'>Lost in the code?</h2>
      <p className='notfound-message'>This page doesn’t exist—but a great developer always finds their way back.</p>
      <a className='notfound-home-btn' href='/'>
        Back to Home
      </a>
      <a
        className='notfound-resume-btn'
        href='/Mazen_Emam_Mid_Senior_Frontend_Engineer.pdf'
        target='_blank'
        rel='noopener noreferrer'
      >
        Download Resume
      </a>
    </main>
  );
}
