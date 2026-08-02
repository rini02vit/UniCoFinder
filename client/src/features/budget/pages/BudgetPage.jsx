import React from 'react';
import { useBudgetCalculator } from '../hooks/useBudgetCalculator';
import BudgetForm from '../components/BudgetForm';
import BudgetSummary from '../components/BudgetSummary';

const BudgetPage = () => {
  const { expenses, updateExpense, reset, currency, isConverting, handleCurrencyChange, derived } = useBudgetCalculator();

  return (
    <div>
      <header style={{ marginBottom: '2rem' }}>
        <h2>Budget Calculator</h2>
        <p className="text-secondary">Estimate your total expenses for studying abroad.</p>
      </header>

      {/* 
        Responsive layout: 
        On desktop, it uses the 2-column grid.
        On mobile, flex-wrap kicks in or we use a standard grid gap. 
        We'll use a responsive flex container or grid here.
      */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '2rem',
          alignItems: 'start'
        }}
      >
        <BudgetForm 
          expenses={expenses} 
          updateExpense={updateExpense} 
          onReset={reset} 
          currency={currency}
          onCurrencyChange={handleCurrencyChange}
          isConverting={isConverting}
        />
        
        <BudgetSummary 
          totalAnnualCost={derived.totalAnnualCost} 
          chartSegments={derived.chartSegments} 
          currency={currency}
        />
      </div>
    </div>
  );
};

export default BudgetPage;
