import { Component, OnInit, computed, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { toObservable } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

interface Task {
  name: string,
  isCompleted: boolean
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'signals-example';

  name = signal<string>("Juan");
  description = signal<string>('signals-example').asReadonly();
  tasks = signal<Task[]>([
    {
      name: "Curso signals",
      isCompleted: false
    }
  ]);

  task$ = toObservable(this.tasks);

  taskLength = computed(() => this.tasks().length);

  constructor() {
    effect(
      () => {
        if(this.taskLength() > 3) alert('Tienes Muchas Tareas!!!')
      });
  }
  ngOnInit(): void {
    this.task$
      .pipe(
        map((res) => {
          const newTask = res.map((task)=>({
            ...task,
            createDate: new Date(),
          }));
          return newTask
        })
      ).subscribe((res) => console.log(res));
  }

  togleName() {
    this.name.set("Sebastian");
  }

  addTask() {
    this.tasks.update((tasks)=>{
      return [ ...tasks,
        {
          name: "Curso NestJs",
          isCompleted: false
        }
      ]
    })
  }

  markTask() {
    this.tasks.update( tasks => {
      this.tasks()[0].name = "Cambio Signal";
      this.tasks()[0].isCompleted = false;
      return tasks;
    })
  }
}
