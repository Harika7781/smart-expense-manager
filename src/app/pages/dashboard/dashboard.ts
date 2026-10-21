
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  Transaction,
  TransactionRecord
} from '../../core/services/transaction';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CurrencyPipe, DecimalPipe, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  transactionData;

  currentMonth = new Date().toLocaleDateString('en-IN', {
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
    return this.transactionService.getIncome();
  }

  get expenses(): number {
    return this.transactionService.getExpenses();
  }

  get balance(): number {
    return this.income - this.expenses;
  }

  get recentTransactions(): TransactionRecord[] {
    return this.transactions.slice(0, 5);
  }

  get incomeHeight(): number {
    const maximum = Math.max(this.income, this.expenses, 1);
    return (this.income / maximum) * 100;
  }

  get expenseHeight(): number {
    const maximum = Math.max(this.income, this.expenses, 1);
    return (this.expenses / maximum) * 100;
  }

  get expenseBreakdown(): {
    category: string;
    amount: number;
    color: string;
  }[] {
    const colors = [
      '#7567e8',
      '#37b897',
      '#f2b84b',
      '#ef7777',
      '#4b9de8',
      '#a17ad7'
    ];

    const totals = new Map<string, number>();

    this.transactions
      .filter(transaction => transaction.type === 'expense')
      .forEach(transaction => {
        totals.set(
          transaction.category,
          (totals.get(transaction.category) ?? 0) + transaction.amount
        );
      });

    return Array.from(totals.entries()).map(([category, amount], index) => ({
      category,
      amount,
      color: colors[index % colors.length]
    }));
  }

  get donutBackground(): string {
    const items = this.expenseBreakdown;

    if (this.expenses <= 0 || items.length === 0) {
      return '#e9eaf2';
    }

    let current = 0;

    const segments = items.map(item => {
      const start = current;
      current += (item.amount / this.expenses) * 100;
      return `${item.color} ${start}% ${current}%`;
    });

    return `conic-gradient(${segments.join(', ')})`;
  }
}
