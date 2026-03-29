import React from 'react';
import { MapPin, Clock, Shield, CheckCircle2, AlertTriangle, ArrowUpRight, ThumbsUp, MessageSquare, ShieldAlert, Zap } from 'lucide-react';
import { IssueReport, UserProfile } from '../types';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { auth } from '../currentUser';
import { toast } from 'sonner';
import { useI18n } from '../i18n';

interface IssueCardProps { issue: IssueReport; user?: UserProfile | null; }

const STATUS: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  Pending:       { bg: 'rgba(245,158,11,0.1)',  text: '#D97706', dot: '#F59E0B', label: 'Pending' },
  Verified:      { bg: 'rgba(99,102,241,0.1)',  text: '#6366F1', dot: '#6366F1', label: 'Verified' },
  'In Progress': { bg: 'rgba(59,130,246,0.1)',  text: '#3B82F6', dot: '#3B82F6', label: 'In Progress' },
  Resolved:      { bg: 'rgba(16,185,129,0.1)',  text: '#10B981', dot: '#10B981', label: 'Resolved' },
  Rejected:      { bg: 'rgba(244,63,94,0.1)',   text: '#F43F5E', dot: '#F43F5E', label: 'Rejected' },
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
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5, scale: 1.01 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="group rounded-2xl overflow-hidden cursor-pointer flex flex-col h-full"
        style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.9)', boxShadow: '0 4px 20px rgba(99,102,241,0.06)' }}>

        {/* Image */}
        <div className="relative aspect-[16/9] overflow-hidden" style={{ background: 'linear-gradient(135deg, #f0f4ff, #faf5ff)' }}>
          <img src={issue.imageUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            alt={issue.category} referrerPolicy="no-referrer"
            onError={e => { (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${issue.id}/800/450`; }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(26,26,46,0.5) 0%, transparent 60%)' }} />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {isOwn && (
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider text-white"
                style={{ background: 'linear-gradient(135deg, #8B5CF6, #6366F1)', boxShadow: '0 2px 8px rgba(99,102,241,0.4)' }}>
                <Zap className="w-2.5 h-2.5" /> Your Report
              </motion.span>
            )}
            <span className="px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider text-white"
              style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)' }}>
              {CAT_EMOJI[issue.category] || '📝'} {issue.category}
            </span>
          </div>

          {issue.aiConfidence !== undefined && (
            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9px] font-bold text-white"
              style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}>
              <Shield className="w-2.5 h-2.5" style={{ color: '#10B981' }} />
              AI {(issue.aiConfidence * 100).toFixed(0)}%
            </div>
          )}

          {issue.isFake && (
            <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-lg text-[9px] font-bold text-white"
              style={{ background: 'rgba(244,63,94,0.85)', backdropFilter: 'blur(8px)' }}>
              <ShieldAlert className="w-2.5 h-2.5" /> Fake
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold"
              style={{ background: status.bg, color: status.text }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: status.dot }} />
              {status.label}
            </span>
            <ArrowUpRight className="w-4 h-4 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              style={{ color: 'rgba(26,26,46,0.2)' }} />
          </div>

          <p className="text-sm font-semibold line-clamp-2 leading-snug flex-1" style={{ color: '#1a1a2e' }}>
            {issue.description || `${issue.category} issue reported`}
          </p>

          <div className="flex items-center gap-1.5" style={{ color: 'rgba(26,26,46,0.4)' }}>
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <p className="text-xs truncate">{issue.address.split(',').slice(0, 2).join(',')}</p>
          </div>

          <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid rgba(99,102,241,0.06)' }}>
            <div className="flex items-center gap-3">
              <button onClick={handleUpvote}
                className="flex items-center gap-1 text-xs font-bold transition-colors"
                style={{ color: isUpvoted ? '#6366F1' : 'rgba(26,26,46,0.3)' }}>
                <ThumbsUp className={`w-3.5 h-3.5 ${isUpvoted ? 'fill-current' : ''}`} />
                {issue.upvotes?.length || 0}
              </button>
              <div className="flex items-center gap-1 text-xs" style={{ color: 'rgba(26,26,46,0.3)' }}>
                <MessageSquare className="w-3.5 h-3.5" />
                {issue.comments?.length || 0}
              </div>
            </div>
            <span className="text-[10px] font-medium" style={{ color: 'rgba(26,26,46,0.3)' }}>
              {new Date(issue.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
