import { useEffect, useState } from 'react';
import { Download, Search, SlidersHorizontal, Trash2, X } from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function Citizens() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    api.get('/citizens', { params: { q, status, category, limit: 100 } })
      .then(response => setItems(response.data.items))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [q, status, category]);

  async function removeCitizen(row) {
    if (!window.confirm(`Delete the record for ${row.fullName}? This action cannot be undone.`)) return;
    setError('');
    try {
      await api.delete(`/citizens/${row._id}`);
      setItems(current => current.filter(item => item._id !== row._id));
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete the citizen record.');
    }
  }

  function exportCsv() {
    const rows = [['Name', 'Phone', 'Ward', 'Area', 'Household', 'Economic category', 'Status'], ...items.map(item => [item.fullName, item.phoneNumber || '', item.wardNumber, item.residentialArea, item.household?.householdCode || '', item.economicCategory, item.verificationStatus])];
    const csv = rows.map(row => row.map(value => `"${String(value).replaceAll('"', '""')}"`).join(',')).join('\n');
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    link.download = 'citizens.csv';
    link.click();
    URL.revokeObjectURL(link.href);
  }

  return <>
    <div className="page-heading"><div><div className="eyebrow">RECORDS</div><h1>{t('Citizen directory')}</h1><p>{t('Search and review citizen profiles in your authorized scope.')}</p></div>
      <div className="heading-actions"><button className="secondary-button" onClick={exportCsv}><Download size={15}/>{t('Export CSV')}</button></div>
    </div>
    {error && <div className="inline-error">{t(error)}</div>}
    <section className="panel directory-panel"><div className="directory-toolbar"><div className="search-box"><Search size={16}/><input placeholder={t('Search by citizen name...')} value={q} onChange={event => setQ(event.target.value)}/>{q && <button onClick={() => setQ('')}><X size={14}/></button>}</div>
      <div className="filters"><SlidersHorizontal size={15}/><select value={status} onChange={event => setStatus(event.target.value)}><option value="">{t('All statuses')}</option><option value="PENDING">{t('Pending')}</option><option value="VERIFIED">{t('Verified')}</option><option value="REJECTED">{t('Rejected')}</option><option value="NEEDS_CORRECTION">{t('Needs correction')}</option></select><select value={category} onChange={event => setCategory(event.target.value)}><option value="">{t('All categories')}</option><option value="SAMPANNA">Sampanna</option><option value="MADHYAM">Madhyam</option><option value="BIPANNA">Bipanna</option></select></div>
    </div><div className="table-wrap"><table><thead><tr><th>CITIZEN</th><th>WARD / AREA</th><th>HOUSEHOLD</th><th>CLASSIFICATION</th><th>STATUS</th><th>SUBMITTED</th>{user.role === 'ADMIN' && <th></th>}</tr></thead><tbody>
      {items.map(row => <tr key={row._id}><td><div className="citizen-cell"><div className="table-avatar">{row.fullName?.split(' ').map(name => name[0]).slice(0, 2).join('').toUpperCase()}</div><div><b>{row.fullName}</b><span>{row.phoneNumber || t('Phone not provided')}</span></div></div></td>
        <td><b>{t('Ward number')} {row.wardNumber}</b><span className="cell-sub">{row.residentialArea || '—'}</span></td><td>{row.household?.householdCode || '—'}<span className="cell-sub">{row.household?.familyMemberCount || '—'} {t('Family members').toLowerCase()}</span>{row.familyMemberNames?.length > 0 && <span className="cell-sub">{row.familyMemberNames.join(', ')}</span>}</td>
        <td><span className={`category-pill ${row.economicCategory?.toLowerCase()}`}>{row.economicCategory?.toLowerCase()}</span><span className="cell-sub">{t(row.categorySource === 'SELF_REPORTED' ? 'Self reported' : 'Provisional assessment')}</span></td>
        <td><span className={`status-pill ${row.verificationStatus?.toLowerCase()}`}><i/>{t(row.verificationStatus?.replace('_', ' ').toLowerCase())}</span>{row.rejectionReason && <span className="cell-sub">{row.rejectionReason}</span>}{row.correctionMessage && <span className="cell-sub">{row.correctionMessage}</span>}</td>
        <td>{new Date(row.createdAt).toLocaleDateString('en-NP', { day: 'numeric', month: 'short', year: 'numeric' })}<span className="cell-sub">{row.submittedBy?.name || 'Municipal staff'}</span></td>
        {user.role === 'ADMIN' && <td><button type="button" className="row-more delete-citizen" title={t('Delete citizen record')} aria-label={`${t('Delete')} ${row.fullName}`} onClick={() => removeCitizen(row)}><Trash2 size={16}/></button></td>}
      </tr>)}
      {!loading && !items.length && <tr><td className="empty-row" colSpan={user.role === 'ADMIN' ? 7 : 6}>{t('No records match these filters.')}</td></tr>}
    </tbody></table>{loading && <div className="loading-row">{t('Loading records…')}</div>}</div>
    <div className="table-summary">{t('Showing')} {items.length} {t(items.length === 1 ? 'record' : 'records')}<span>{t('Access is restricted to your assigned role and ward.')}</span></div></section>
  </>;
}
