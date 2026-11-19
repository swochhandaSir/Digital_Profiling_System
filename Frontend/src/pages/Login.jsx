import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, LockKeyhole, MapPinned } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function Login() {
  const { login } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      await login({ email, password });
      const from = location.state?.from;
      const destination = from && from.pathname !== '/login'
        ? from.pathname + (from.search || '') + (from.hash || '')
        : '/';
      navigate(destination, { replace: true });
    } catch {
      setError('We couldn’t sign you in. Check your details and try again.');
    } finally {
      setBusy(false);
    }
  }

  return <div className="login-page">
    <div className="login-art"><div className="login-art-grid"/><div className="login-art-inner">
      <div className="login-brand"><div className="brand-mark brand-mark-light"><MapPinned size={20}/></div><span>Dhulikhel <i>Municipality</i></span></div>
      <div className="art-caption"><span className="eyebrow light-eyebrow">{t('DIGITAL MUNICIPAL SERVICES')}</span><h1>{t('A clearer picture')}<br/>{t('of our community.')}</h1><p>{t('One secure place to manage citizen profiles, households and ward level insights.')}</p></div>
      <div className="art-foot"><span>Bagmati Province · Nepal</span><span>Est. 1986</span></div>
    </div></div>
    <div className="login-panel"><button className="language-toggle login-language" onClick={() => setLanguage(language === 'en' ? 'ne' : 'en')}>{language === 'en' ? 'नेपाली' : 'English'}</button><div className="login-form-wrap">
      <div className="login-symbol"><LockKeyhole size={19}/></div><span className="eyebrow">{t('STAFF PORTAL')}</span><h2>{t('Welcome back')}</h2><p className="login-sub">{t('Sign in with your municipal account to continue.')}</p>
      <form onSubmit={submit}><label htmlFor="email">{t('Email address')}</label><input id="email" type="email" autoComplete="username" placeholder="name@dhulikhelmun.gov.np" value={email} onChange={event => setEmail(event.target.value)} required/>
        <label htmlFor="password">{t('Password')}</label><div className="password-field"><input id="password" type={show ? 'text' : 'password'} autoComplete="current-password" placeholder={t('Enter your password')} value={password} onChange={event => setPassword(event.target.value)} required/><button type="button" className="password-toggle" onClick={() => setShow(!show)} aria-label={show ? 'Hide password' : 'Show password'}>{show ? <EyeOff size={17}/> : <Eye size={17}/>}</button></div>
        {error && <div className="form-error">{t(error)}</div>}<button className="primary-button login-submit" disabled={busy}>{busy ? t('Signing in…') : t('Sign in')}<ArrowRight size={16}/></button>
      </form><div className="login-security"><LockKeyhole size={14}/><span>{t('Your connection is protected with secure authentication.')}</span></div>
    </div><div className="login-footer">{t('For authorized municipal personnel only')} <i/> <a href="mailto:it@dhulikhelmun.gov.np">{t('Get help')}</a></div></div>
  </div>;
}
