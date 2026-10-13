import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Project } from '../../models/project.model';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css'
})
export class TasksComponent {
  projects: Project[] = [];
  tasksByProject: { [key: number]: Task[] } = {};
  loading = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadProjectsAndTasks();
  }

  loadProjectsAndTasks(): void {
    this.loading = true;
    this.http.get<Project[]>('http://localhost:8081/projects').subscribe({
      next: (projects) => {
        this.projects = projects;
        let pending = projects.length;
        if (pending === 0) {
          this.loading = false;
          return;
        }
        projects.forEach(project => {
          this.http.get<Task[]>(`http://localhost:8081/projects/${project.slug}/tasks`).subscribe({
            next: (tasks) => {
              this.tasksByProject[project.id] = tasks;
              pending--;
              if (pending === 0) this.loading = false;
            },
            error: (err) => {
              console.error(`Erreur lors du chargement des tâches du projet ${project.slug}`, err);
              this.tasksByProject[project.id] = [];
              pending--;
              if (pending === 0) this.loading = false;
            }
          });
        });
      },
      error: (err) => {
        console.error('Erreur lors du chargement des projets', err);
        this.loading = false;
      }
    });
  }
}
