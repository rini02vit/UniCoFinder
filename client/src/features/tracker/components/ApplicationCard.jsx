import React, { useMemo } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import TrackerTimeline from './TrackerTimeline';
import TrackerProgress from './TrackerProgress';
import TrackerChecklist from './TrackerChecklist';
import TrackerDeadlines from './TrackerDeadlines';
import { useChecklistState } from '../hooks/useChecklistState';
import { calculateOverallProgress, calculateWorkflowProgress } from '../utils/progressCalculator';
import { TIMELINE_STAGES, CHECKLIST_TEMPLATE } from '../constants/trackerConfig';

const ApplicationCard = ({ application, expanded, onToggle }) => {
  const { checkedItems, toggleItem, isUpdating } = useChecklistState(application);
  
  // Calculate derived values memoized to prevent recalculation on parent rerender
  const { overallProgress, workflowProgress } = useMemo(() => ({
    overallProgress: calculateOverallProgress(application.status, checkedItems),
    workflowProgress: calculateWorkflowProgress(application.status)
  }), [application.status, checkedItems]);

  return (
    <div className="card" style={{ marginBottom: '1.5rem', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden' }}>
      
      {/* Header Summary Section */}
      <div 
        style={{ padding: '1.5rem', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '1rem', background: expanded ? 'rgba(14, 165, 233, 0.05)' : 'transparent', transition: 'background 0.3s ease' }}
        onClick={() => onToggle(application.id)}
        aria-expanded={expanded}
        aria-controls={`content-${application.id}`}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onToggle(application.id); }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', color: 'var(--text-primary)' }}>{application.universityName}</h3>
            <span className={`badge badge-${application.statusVariant}`}>
              {application.status}
            </span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flex: 1, minWidth: '250px', maxWidth: '400px' }}>
            <TrackerProgress 
              value={overallProgress} 
              label="Overall Progress" 
              color="var(--primary-cyan)" 
            />
            {expanded ? <ChevronUp size={24} color="var(--text-secondary)" /> : <ChevronDown size={24} color="var(--text-secondary)" />}
          </div>
        </div>
      </div>

      {/* Expanded Details Section */}
      {expanded && (
        <div id={`content-${application.id}`} style={{ padding: '0 1.5rem 1.5rem 1.5rem', borderTop: '1px solid var(--border-color)' }}>
          
          <TrackerTimeline 
            stages={TIMELINE_STAGES} 
            activeStage={application.currentStage} 
            completedStages={application.completedStages}
          />
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
            <div>
              <TrackerChecklist 
                template={CHECKLIST_TEMPLATE}
                checkedItems={checkedItems}
                onToggle={toggleItem}
                disabled={application.isTerminalStatus || isUpdating}
              />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="card" style={{ padding: '1.5rem', marginTop: '1.5rem' }}>
                 <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.1rem', color: 'var(--text-primary)' }}>Workflow Breakdown</h3>
                 <TrackerProgress 
                    value={workflowProgress} 
                    label="University Processing" 
                    color="var(--primary-blue)" 
                  />
                  <div style={{ marginTop: '1rem' }}>
                    <TrackerProgress 
                      value={calculateOverallProgress(application.status, checkedItems)} // Checklist contribution derived inside the generic func, but we can visually split it if we want. Overall is sufficient.
                      label="Your Tasks" 
                      color="var(--primary-purple)" 
                    />
                  </div>
              </div>

              <TrackerDeadlines 
                updatedAt={application.updatedAt}
                isTerminalStatus={application.isTerminalStatus}
              />
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default React.memo(ApplicationCard);
