
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../modules/auth/auth.service';

@Component({
  selector: 'pomodoro-spotify-status-page',
  templateUrl: './spotify-status-page.component.html',
  styleUrl: './spotify-status-page.component.css',
})
export class SpotifyStatusPageComponent implements OnInit{

  statusMessage:string = ""
  status:number = 0
  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router:Router) {}
  ngOnInit(): void {
    this.authService.UpdateUser().subscribe();
    this.route.queryParams.subscribe((params)=>{
      console.log(params)
      this.status = Number.parseInt(params['status']!);
      this.statusMessage = params['statusMessage']!;
      setTimeout(()=>
      {
        this.router.navigateByUrl("")
      },5000)

    })

  }

}
