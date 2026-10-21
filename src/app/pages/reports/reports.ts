
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Component } from '@angular/core';
import { Transaction, TransactionRecord } from '../../core/services/transaction';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CurrencyPipe, DecimalPipe],
  templateUrl: './reports.html',
  styleUrl: './reports.css'
})
export class Reports {
  transactionData: () => TransactionRecord[] = () => [];
  currentDate = new Date().toLocaleDateString('en-IN', {
  month: 'long',
  year: 'numeric'
});

  constructor(private transactionService: Transaction) {
    this.transactionData = this.transactionService.getAllSignal();
  }

  get transactions(): TransactionRecord[] {
    return this.transactionData();
  }

  get income(): number {
    return this.transactions
      .filter(item => item.type === 'income')
      .reduce((total, item) => total + item.amount, 0);
  }

  get expenses(): number {
    return this.transactions
      .filter(item => item.type === 'expense')
      .reduce((total, item) => total + item.amount, 0);
  }

  get balance(): number {
    return this.income - this.expenses;
  }

  get savingsRate(): number {
    if (this.income <= 0) return 0;
    return (this.balance / this.income) * 100;
  }

  get expenseBreakdown() {
    const totals = new Map<string, number>();

    this.transactions
      .filter(item => item.type === 'expense')
      .forEach(item => {
        totals.set(
          item.category,
          (totals.get(item.category) ?? 0) + item.amount
        );
      });

    return Array.from(totals.entries())
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: this.expenses > 0 ? (amount / this.expenses) * 100 : 0
      }))
      .sort((a, b) => b.amount - a.amount);
  }

  get largestExpense() {
    return this.transactions
      .filter(item => item.type === 'expense')
      .sort((a, b) => b.amount - a.amount)[0] ?? null;
  }

  get incomeTransactions(): TransactionRecord[] {
    return this.transactions.filter(item => item.type === 'income');
  }

  get expenseTransactions(): TransactionRecord[] {
    return this.transactions.filter(item => item.type === 'expense');
  }
}
