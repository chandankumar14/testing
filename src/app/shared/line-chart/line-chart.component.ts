import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';

import { Chart } from 'angular-highcharts';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css'],
})
export class LineChartComponent implements OnInit, AfterViewInit {
  @ViewChild('container') container: ElementRef;
  @Input('config') config;

  chart: any = null;
  constructor() {}

  ngOnInit(): void {
    this.initializeChart();
  }

  initializeChart() {
    this.chart = new Chart(this.config);
  }

  ngAfterViewInit() {
    const containerEl = this.container.nativeElement;
  }

  subscribeResize() {
    const resizeObserver = new ResizeObserver(() => {
      console.log("chage screen")
      this.initializeChart();
    });

    resizeObserver.observe(this.container.nativeElement);
  }

  onResize() {
    setTimeout(() => {
      this.initializeChart();
    }, 2000)
  }
}
