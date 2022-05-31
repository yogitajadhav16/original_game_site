import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription, tap } from 'rxjs';
import { APIResponse, Game } from 'src/app/models';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {

  public sort: string='';
  public games: Array<Game>=[];
  private routeSub: Subscription=new Subscription;
  private gameSub: Subscription = new Subscription;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  
  constructor(    
    private httpService: HttpService,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.routeSub = this.activatedRoute.params.subscribe((params: Params) => {
      if (params['game-search']) {
        this.searchGames('metacrit', params['game-search']);
      } else {
        this.searchGames('metacrit');
      }
    });
  }

  searchGames(sort: string, search?: string): void {
    this.gameSub = this.httpService
      .getGameList(sort, search)
      .subscribe((gameList: APIResponse<Game>) => {
        this.games = gameList.results;
        this.paginator?.pageIndex ?? 0,
        this.paginator?.pageSize ?? 3,
        console.log(gameList);
      });
  }

openGameDetails(id: string): void {
this.router.navigate(['details',id]);
}

ngOnDestroy() :void{
if(this.gameSub) {
  this.gameSub.unsubscribe();
}
if(this.routeSub) {
  this.routeSub.unsubscribe();
}
}
ngAfterViewInit(): void {
    this.paginator.page.pipe(tap(() => this.searchGames(this.sort,'null')));
}
}
