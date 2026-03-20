import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-summary',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-summary.html',
  styleUrls: ['./admin-summary.css']
})
export default class AdminSummary implements OnInit {
  users: any[] = [];
  summary: string = '';
  permanentAdminEmail = 'admin@gmail.com';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadSummary();
    this.loadUsers();
  }

  // ✅ Load system summary
  loadSummary() {
    this.http.get('https://backend-production-35363.up.railway.app/api/admin/summary', { responseType: 'text' })
      .subscribe({
        next: (res) => (this.summary = res),
        error: () => (this.summary = '⚠️ Error loading summary')
      });
  }

  // ✅ Load all users
  loadUsers() {
    this.http.get<any[]>('https://backend-production-35363.up.railway.app/api/admin/users')
      .subscribe({
        next: (res) => (this.users = res),
        error: () => alert('⚠️ Failed to fetch users')
      });
  }

  // ✅ Update role dynamically (auto-refreshes UI)
  updateRole(userId: number, newRole: string) {
    this.http.put(`https://backend-production-35363.up.railway.app/api/admin/users/${userId}/role?newRole=${newRole}`, {}, { responseType: 'text' })
      .subscribe({
        next: (msg) => {
          alert(msg);
          this.loadUsers(); // 🔁 Refresh user list instantly
        },
        error: () => alert('❌ Failed to update role')
      });
  }

  // ✅ Delete user with confirmation
  deleteUser(userId: number, email: string) {
    if (email === this.permanentAdminEmail) {
      alert('⛔ Cannot delete the permanent admin!');
      return;
    }

    if (confirm(`Are you sure you want to delete user ID ${userId}?`)) {
      this.http.delete(`https://backend-production-35363.up.railway.app/api/admin/users/${userId}`, { responseType: 'text' })
        .subscribe({
          next: (msg) => {
            alert(msg);
            this.loadUsers(); // 🔁 Refresh after deletion
          },
          error: () => alert('❌ Failed to delete user')
        });
    }
  }
}
