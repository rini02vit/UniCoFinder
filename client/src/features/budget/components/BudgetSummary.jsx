import React from 'react';
import BreakdownChart from './BreakdownChart';
import BudgetLegend from './BudgetLegend';
import { formatCurrency } from '../../../utils/formatters';

const BudgetSummary = ({ totalAnnualCost, chartSegments, currency }) => {
  return (
    <div>
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.1), rgba(167, 139, 250, 0.1))',
          borderColor: 'var(--primary-cyan)',
          padding: '2rem',
          position: 'sticky',
          top: '2rem'
        }}
      >
        <h3 className="card-title text-center mb-1">Estimated Annual Cost</h3>
        
        <div
          className="text-center"
          aria-live="polite"
          style={{
            fontSize: '3.5rem',
            fontWeight: 800,
            color: 'var(--primary-cyan)',
            marginBottom: '1rem',
            wordBreak: 'break-word'
          }}
        >
          {formatCurrency(totalAnnualCost, currency)}
        </div>
        
        <p className="text-center text-secondary mb-3">
          Includes 1 year of tuition and 12 months of living expenses.
        </p>

        {/* Visual Bar */}
        <BreakdownChart segments={chartSegments} />

        {/* Legend */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            justifyContent: 'center',
            marginTop: '1.5rem'
          }}
        >
          {chartSegments.map(seg => (
            seg.id !== 'empty' && (
              <BudgetLegend 
                key={seg.id} 
                label={seg.label} 
                color={seg.color} 
              />
            )
          ))}
        </div>
        
        {totalAnnualCost === 0 && (
          <p className="text-center text-secondary mt-3" style={{ fontSize: '0.9rem' }}>
            Enter an expense to see the breakdown.
          </p>
        )}
      </div>
    </div>
  );
};

export default BudgetSummary;
