
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Component } from '@angular/core';
import { Transaction, TransactionRecord } from '../../core/services/transaction';

@Component({
  selector: 'app-budgets',
  standalone: true,
  imports: [CurrencyPipe, DecimalPipe],
  templateUrl: './budgets.html',
  styleUrl: './budgets.css'
})
export class Budgets {
  monthlyBudget = 15000;
  transactionData: () => TransactionRecord[] = () => [];

  constructor(private transactionService: Transaction) {
    this.transactionData = this.transactionService.getAllSignal();
  }

  get transactions(): TransactionRecord[] {
    return this.transactionData();
  }

  get totalSpent(): number {
    return this.transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  }

  get remainingBudget(): number {
    return this.monthlyBudget - this.totalSpent;
  }

  get spendingPercentage(): number {
    return this.monthlyBudget > 0
      ? Math.min((this.totalSpent / this.monthlyBudget) * 100, 100)
      : 0;
  }

  get budgetStatus(): string {
    if (this.totalSpent > this.monthlyBudget) return 'Budget exceeded';
    if (this.spendingPercentage >= 80) return 'Almost at limit';
    return 'Within budget';
  }

  get categoryBudgets() {
    const limits: Record<string, number> = {
      Food: 4000,
      Bills: 2000,
      Transport: 2000,
      Shopping: 2500,
      Entertainment: 1500,
      Other: 3000
    };

    return Object.entries(limits).map(([category, limit]) => {
      const spent = this.transactions
        .filter(t => t.type === 'expense' && t.category === category)
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        category,
        limit,
        spent,
        percentage: Math.min((spent / limit) * 100, 100),
        remaining: limit - spent
      };
    });
  }

  updateBudget(value: string): void {
    const amount = Number(value);
    if (Number.isFinite(amount) && amount > 0) {
      this.monthlyBudget = amount;
    }
  }
}
