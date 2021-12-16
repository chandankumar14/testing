import { BehaviorSubject, Subject } from 'rxjs';

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

    public loaderStatus: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    displayLoader(value: boolean) {
        this.loaderStatus.next(value);
    }
}