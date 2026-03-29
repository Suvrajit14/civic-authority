import React from 'react';
import { MapPin, Clock, Shield, CheckCircle2, AlertTriangle, ArrowUpRight, ThumbsUp, MessageSquare, ShieldAlert, Zap } from 'lucide-react';
import { IssueReport, UserProfile } from '../types';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { auth } from '../currentUser';
import { toast } from 'sonner';
import { useI18n } from '../i18n';

interface IssueCardProps {
  issue: IssueReport;
  user?: UserProfile | null;
}

const STATUS: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  Pending:       { bg: 'rgba(255,184,0,0.12)',   text: '#FFB800', dot: '#FFB800', label: 'Pending' },
  Verified:      { bg: 'rgba(0,255,136,0.12)',   text: '#00FF88', dot: '#00FF88', label: 'Verified' },
  'In Progress': { bg: 'rgba(0,212,255,0.12)',   text: '#00D4FF', dot: '#00D4FF', label: 'In Progress' },
  Resolved:      { bg: 'rgba(0,255,136,0.15)',   text: '#00FF88', dot: '#00FF88', label: 'Resolved' },
  Rejected:      { bg: 'rgba(255,60,172,0.12)',  text: '#FF3CAC', dot: '#FF3CAC', label: 'Rejected' },
};

const CAT_EMOJI: Record<string, string> = {
  Traffic: '🚦', Road: '🛣️', Emergency: '🚨', Safety: '🛡️',
  Sanitation: '♻️', Water: '💧', Electricity: '⚡', Environment: '🌳',
  Infrastructure: '🏗️', 'Public Health': '🏥', Other: '📝',
};

export default function IssueCard({ issue }: IssueCardProps) {
  const { t } = useI18n();
  const status = STATUS[issue.status] || STATUS.Pending;
  const isUpvoted = auth.currentUser ? issue.upvotes?.includes(auth.currentUser.uid) : false;
  const isOwn = auth.currentUser?.uid === issue.reporterUid;

  const handleUpvote = async (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (!auth.currentUser) return;
    try {
      await fetch(`/api/issues/${issue.id}/upvote`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: auth.currentUser.uid, action: isUpvoted ? 'remove' : 'add' })
      });
      toast.success(isUpvoted ? 'Upvote removed' : 'Issue upvoted');
    } catch { toast.error('Failed to upvote'); }
  };

  return (
    <Link to={`/issue/${issue.id}`}>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -4 }}
        className="group rounded-2xl overflow-hidden cursor-pointer flex flex-col h-full transition-all duration-300"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,255,136,0.2)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(0,255,136,0.08)'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}>

        {/* Image */}
        <div className="relative aspect-[16/9] overflow-hidden" style={{ background: '#1a1a2e' }}>
          <img src={issue.imageUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            alt={issue.category} referrerPolicy="no-referrer"
            onError={e => { (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${issue.id}/800/450?blur=2`; }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,10,20,0.8) 0%, transparent 60%)' }} />

          {/* Top badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {isOwn && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider"
                style={{ background: 'rgba(0,255,136,0.2)', color: '#00FF88', border: '1px solid rgba(0,255,136,0.3)' }}>
                <Zap className="w-2.5 h-2.5" /> Your Report
              </span>
            )}
            <span className="px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider"
              style={{ background: 'rgba(0,0,0,0.6)', color: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(8px)' }}>
              {CAT_EMOJI[issue.category] || '📝'} {issue.category}
            </span>
          </div>

          {/* AI confidence */}
          {issue.aiConfidence !== undefined && (
            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9px] font-bold"
              style={{ background: 'rgba(0,0,0,0.7)', color: '#00FF88', backdropFilter: 'blur(8px)' }}>
              <Shield className="w-2.5 h-2.5" />
              AI {(issue.aiConfidence * 100).toFixed(0)}%
            </div>
          )}

          {issue.isFake && (
            <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-lg text-[9px] font-bold"
              style={{ background: 'rgba(255,60,172,0.3)', color: '#FF3CAC', border: '1px solid rgba(255,60,172,0.4)' }}>
              <ShieldAlert className="w-2.5 h-2.5" /> Fake
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col gap-3">
          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold"
              style={{ background: status.bg, color: status.text }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: status.dot }} />
              {status.label}
            </span>
            <ArrowUpRight className="w-4 h-4 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              style={{ color: 'rgba(255,255,255,0.2)' }} />
          </div>

          {/* Description */}
          <p className="text-sm font-semibold text-white line-clamp-2 leading-snug flex-1">
            {issue.description || `${issue.category} issue reported`}
          </p>

          {/* Location */}
          <div className="flex items-center gap-1.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <p className="text-xs truncate">{issue.address.split(',').slice(0, 2).join(',')}</p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-center gap-3">
              <button onClick={handleUpvote}
                className="flex items-center gap-1 text-xs font-bold transition-colors"
                style={{ color: isUpvoted ? '#00FF88' : 'rgba(255,255,255,0.3)' }}>
                <ThumbsUp className={`w-3.5 h-3.5 ${isUpvoted ? 'fill-current' : ''}`} />
                {issue.upvotes?.length || 0}
              </button>
              <div className="flex items-center gap-1 text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
                <MessageSquare className="w-3.5 h-3.5" />
                {issue.comments?.length || 0}
              </div>
            </div>
            <span className="text-[10px] font-medium" style={{ color: 'rgba(255,255,255,0.2)' }}>
              {new Date(issue.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
