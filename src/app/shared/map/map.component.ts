import * as L from 'leaflet';

import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements AfterViewInit {
  private map;
  @Input('latlong') latlong: number[] = [45.51877834815366, -122.67981871962547];
  @ViewChild('mapContainer') mapContainer: ElementRef;
  data: any = {
    type: 'FeatureCollection',
    features: [
      {
        id: '0',
        type: 'Feature',
        properties: {
          'asset-class': 'camera',
          'asset-date': '11/04/2021',
          'asset-id': '12321',
          'asset-parameters': {
            model: 'AXIS Q6045-E Mk II',
            date: '_',
            resolution: '1080p',
            zoom: '30x',
            focusRange: '_',
            storage: 'None',
            dimension: '_',
            latency: '14ms',
            network: 'Ethernet',
            power: 'PoE',
            link: 'http://192.168.4.25:8080/video',
            owner: 'Admin',
          },
          'asset-usage': 'public',
          fill: null,
          'fill-opacity': null,
          'marker-color': '#00d9ff',
          'marker-size': 'medium',
          'marker-symbol': 'camera',
          stroke: null,
          'stroke-opacity': null,
          'stroke-width': null,
        },
        geometry: {
          type: 'Point',
          coordinates: [-122.67981871962547, 45.51877834815366],
        },
      },
      {
        id: '1',
        type: 'Feature',
        properties: {
          'asset-class': 'camera-fov',
          'asset-date': '11/04/2021',
          'asset-id': '12321',
          'asset-parameters': {
            owner: 'Admin',
          },
          'asset-usage': 'limited',
          fill: '#f3c7ff',
          'fill-opacity': 0.2,
          'marker-color': null,
          'marker-size': null,
          'marker-symbol': null,
          stroke: '#ce85ff',
          'stroke-opacity': 1,
          'stroke-width': 2,
        },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [-122.680002450943, 45.5189324553022],
              [-122.67979323863985, 45.51877271007923],
              [-122.67958939075469, 45.51870505314222],
              [-122.67870426177977, 45.519110993544096],
              [-122.6797905564308, 45.519421084933576],
              [-122.680002450943, 45.5189324553022],
            ],
          ],
        },
      },
      {
        id: '2',
        type: 'Feature',
        properties: {
          'asset-class': 'camera',
          'asset-date': '11/04/2021',
          'asset-id': '12322',
          'asset-parameters': {
            model: 'AXIS Q6045-E Mk II',
            date: '_',
            resolution: '1080p',
            zoom: '30x',
            focusRange: '_',
            storage: 'None',
            dimension: '_',
            latency: '14ms',
            network: 'Ethernet',
            power: 'PoE',
            link: 'http://192.168.4.26:8080/video',
            owner: 'Admin',
          },
          'asset-usage': 'public',
          fill: null,
          'fill-opacity': null,
          'marker-color': '#00d9ff',
          'marker-size': 'medium',
          'marker-symbol': 'camera',
          stroke: null,
          'stroke-opacity': null,
          'stroke-width': null,
        },
        geometry: {
          type: 'Point',
          coordinates: [-122.6787257194519, 45.518509599311614],
        },
      },
      {
        id: '3',
        type: 'Feature',
        properties: {
          'asset-class': 'camera-fov',
          'asset-date': '11/04/2021',
          'asset-id': '12322',
          'asset-parameters': {
            owner: 'Admin',
          },
          'asset-usage': 'limited',
          fill: '#f3c7ff',
          'fill-opacity': 0.2,
          'marker-color': null,
          'marker-size': null,
          'marker-symbol': null,
          stroke: '#ce85ff',
          'stroke-opacity': 1,
          'stroke-width': 2,
        },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [-122.67873108386992, 45.518509599311614],
              [-122.67862111330031, 45.519084682680884],
              [-122.67925947904585, 45.51927261714823],
              [-122.67962425947188, 45.518511478678604],
              [-122.67892152070999, 45.518295351063436],
              [-122.67873108386992, 45.518509599311614],
            ],
          ],
        },
      },
    ],
  };
  private initMap(latlong): void {
    // const myCenter = new L.LatLng(45.51877834815366, -122.67981871962547);
    this.map = L.map('map', {
      center: latlong,
      zoom: 18,
    })
    //.setView([45.51877834815366, -122.67981871962547]);
    // const tiles = L.tileLayer(
    //   'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    //   {
    //     maxZoom: 18,
    //     minZoom: 3,
    //     attribution:
    //       '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    //   }
    // );

    // L.mapbox.accessToken = environment.mapboxAccessToken;
    // Help from Heat map
    const tiles = L.tileLayer(
      'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}',
      {
        attribution:
          'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken:
          'pk.eyJ1IjoicmFqYXRnaXJpIiwiYSI6ImNra255anBvMzNuNmYybm9jdjZxZDNqNHcifQ.0T-13cOjpkzgpwYokLTrEA',
      }
    );
    tiles.addTo(this.map);

    function onEachFeature(feature, layer) {
      console.log("BBB ",feature)
      layer.bindPopup("test");
    }

    // create your custom icon
    const cameraIcon = L.icon({
      iconUrl: '/assets/image/camera.png',
      iconSize: [31, 71],
      iconAnchor: [16, 37],
      popupAnchor: [0, -28],
    });

    L.geoJSON(this.data, {
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, { icon: cameraIcon });
      },
      onEachFeature: onEachFeature
    }).addTo(this.map);

    // this.addControlPlaceholders(this.map);

    // // Change the position of the Zoom Control to a newly created placeholder.
    // this.map.zoomControl.setPosition('verticalcenterright');

    // // You can also put other controls in the same placeholder.
    // L.control
    //   .scale({
    //     position: 'verticalcenterright',
    //   })
    //   .addTo(this.map);

    // // this.map.createPane('labels');
  }

  constructor() {}

  getLatLongsFromMarkers(coords) {}

  ngAfterViewInit(): void {
    this.subscribeResize();
    if (this.latlong) this.initMap(this.latlong);
  }

  addControlPlaceholders(map) {
    var corners = map._controlCorners,
      l = 'leaflet-',
      container = map._controlContainer;

    function createCorner(vSide, hSide) {
      var className = l + vSide + ' ' + l + hSide;

      corners[vSide + hSide] = L.DomUtil.create('div', className, container);
    }

    createCorner('verticalcenter', 'left');
    createCorner('verticalcenter', 'right');
  }

  subscribeResize() {
    const resizeObserver = new ResizeObserver(() => {
      this.map.invalidateSize();
    });

    resizeObserver.observe(this.mapContainer.nativeElement);
  }
}
