import React from 'react';
import { Certificate } from '../types';
import { Award, Building, Calendar, Hash, Share2, ShieldCheck, ShieldX } from 'lucide-react';
import { useTheme } from '../App';

interface CertificateCardProps {
  certificate: Certificate;
}

const CertificateCard: React.FC<CertificateCardProps> = ({ certificate }) => {
  const { theme } = useTheme();
  const {
    studentName,
    degree,
    major,
    issuingUniversity,
    issueDate,
    isRevoked,
    id
  } = certificate;
  
  const gridPattern = theme === 'dark' 
    ? { backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '20px 20px' }
    : { backgroundImage: 'linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)', backgroundSize: '20px 20px' };

  return (
    <div className="p-[1.5px] bg-gradient-to-br from-primary/50 via-primary/20 to-transparent rounded-2xl shadow-lg hover:shadow-primary/30 transition-shadow duration-300 animate-slide-up w-full">
        <div className="bg-surface-light dark:bg-surface rounded-[15px] p-5 h-full" style={gridPattern}>
          <div className="flex justify-between items-start">
            <div className="flex-grow">
              <h3 className="text-xl font-bold text-primary-light dark:text-primary-dark tracking-tight font-heading">{degree}</h3>
              <p className="text-sm text-text-secondary-light dark:text-text-secondary font-medium">{major}</p>
            </div>
            <div className={`flex items-center gap-2 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${isRevoked ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
              {isRevoked ? <ShieldX size={14} /> : <ShieldCheck size={14} />}
              <span>{isRevoked ? 'Revoked' : 'Verified'}</span>
            </div>
          </div>
          
          <div className="my-6 space-y-3 text-sm">
            <div className="flex items-center gap-3 text-text-primary-light dark:text-text-primary">
              <Award className="w-5 h-5 text-primary-light dark:text-primary-dark" />
              <span>{studentName}</span>
            </div>
            <div className="flex items-center gap-3 text-text-primary-light dark:text-text-primary">
              <Building className="w-5 h-5 text-primary-light dark:text-primary-dark" />
              <span>{issuingUniversity}</span>
            </div>
            <div className="flex items-center gap-3 text-text-primary-light dark:text-text-primary">
              <Calendar className="w-5 h-5 text-primary-light dark:text-primary-dark" />
              <span>Issued on: {issueDate}</span>
            </div>
          </div>
          
          <div className="pt-4 border-t border-white/10 dark:border-white/10">
              <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-xs text-text-secondary-light dark:text-text-secondary truncate">
                      <Hash size={14} />
                      <span className="font-mono truncate">{id}</span>
                  </div>
                  <button className="flex items-center gap-2 text-sm font-semibold text-primary-light dark:text-primary-dark hover:text-primary dark:hover:text-primary transition-colors">
                      <Share2 size={16} />
                      <span>Share</span>
                  </button>
              </div>
          </div>
        </div>
      </div>
  );
};

export default CertificateCard;