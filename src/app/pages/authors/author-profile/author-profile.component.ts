
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-author-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mt-5">
      <div class="row">
        <div class="col-md-4">
          <div class="card mb-4">
            <div class="card-body text-center">
              <img src="https://via.placeholder.com/150" class="rounded-circle mb-3" alt="Уитни Райт">
              <h3 class="card-title">Уитни Райт</h3>
              <p class="text-muted">Политически анализатор</p>
              <div class="d-flex justify-content-center gap-2">
                <a href="#" class="btn btn-sm btn-outline-primary"><i class="fa fa-twitter"></i></a>
                <a href="#" class="btn btn-sm btn-outline-primary"><i class="fa fa-linkedin"></i></a>
                <a href="#" class="btn btn-sm btn-outline-primary"><i class="fa fa-envelope"></i></a>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-8">
          <h2>За автора</h2>
          <p class="mb-4">
            Уитни Райт е опитен политически анализатор с над 10 години опит в отразяването на политически събития.
            Тя е специализирана в анализа на международни отношения и вътрешна политика. Нейните проницателни 
            коментари и задълбочени анализи са публикувани в редица престижни издания.
          </p>
          
          <h3>Последни статии от Уитни Райт</h3>
          <div class="row mt-3">
            <div class="col-md-6 mb-4">
              <div class="card h-100">
                <div class="card-body">
                  <h5 class="card-title">Анализ на текущата политическа ситуация</h5>
                  <p class="card-text">Кратък преглед на ключовите политически тенденции и тяхното влияние...</p>
                  <small class="text-muted">Публикувано на: 15 юни, 2023</small>
                </div>
                <div class="card-footer bg-transparent">
                  <a href="#" class="btn btn-sm btn-primary">Прочети повече</a>
                </div>
              </div>
            </div>
            <div class="col-md-6 mb-4">
              <div class="card h-100">
                <div class="card-body">
                  <h5 class="card-title">Перспективи за международната политика</h5>
                  <p class="card-text">Подробен анализ на глобалните политически предизвикателства...</p>
                  <small class="text-muted">Публикувано на: 28 май, 2023</small>
                </div>
                <div class="card-footer bg-transparent">
                  <a href="#" class="btn btn-sm btn-primary">Прочети повече</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .rounded-circle {
      width: 150px;
      height: 150px;
      object-fit: cover;
    }
  `]
})
export class AuthorProfileComponent implements OnInit {
  authorId: string | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.authorId = this.route.snapshot.paramMap.get('id');
    // Тук можете да заредите данни за автора по ID, ако имате API
  }
}
