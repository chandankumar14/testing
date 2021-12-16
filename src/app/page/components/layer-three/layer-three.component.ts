import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../../../environments/environment';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-layer-three',
  templateUrl: './layer-three.component.html',
  styleUrls: ['./layer-three.component.css']
})
export class LayerThreeComponent implements OnInit, AfterViewInit {
  @ViewChild('map') map: ElementRef;
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    mapboxgl.accessToken = environment.mapboxAccessToken;
    const map = new mapboxgl.Map({
      container: this.map.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-122.486052, 37.830348],
      zoom: 15,
    });
  }

  public getJSON(url): Observable<any> {
    return this.http.get(url);
  }

}
