import {
  Directive, AfterViewInit,
  ElementRef, Input, EventEmitter,
  Output, OnDestroy
} from '@angular/core';

import { Subscription } from 'rxjs/subscription';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/pairwise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/exhaustMap';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/startWith';
import { ScrollPosition, DEFAULT_SCROLL_POSITION } from '../models/scroll-position';
import { HostListener } from '@angular/core';

@Directive({
  selector: '[lazyInfyScroll]',
  exportAs: 'lazyInfyScroll'
})
export class InfyScrollDirective implements AfterViewInit, OnDestroy {

  private scrollEvent$;

  private userScrolledDown$;

  private requestOnScroll$: Observable<ScrollPosition[]>;

  @Input()
  scrollCallback: Function;

  @Input()
  immediateCallback: boolean;

  @Input()
  scrollPercent = 80;

  constructor(private eleRef: ElementRef) { }

  ngAfterViewInit() {
    this.registerScrollEvent();
    this.observeScroll();
    this.requestCallbackOnScroll();
  }

  reAssign() {
    this.ngAfterViewInit();
  }

  private registerScrollEvent() {
    this.scrollEvent$ = Observable.fromEvent(this.eleRef.nativeElement, 'scroll');
  }

  private observeScroll() {
    this.userScrolledDown$ = this.scrollEvent$
      .map((e): ScrollPosition => ({
        sH: e.target.scrollHeight,
        sT: e.target.scrollTop,
        cH: e.target.clientHeight
      }))
      .pairwise()
      .filter(positions => this.isUserScrollingDown(positions) && this.isScrollExpectedPercent(positions[1]));
  }

  private requestCallbackOnScroll() {

    this.requestOnScroll$ = this.userScrolledDown$;

    if (this.immediateCallback) {
      this.requestOnScroll$ = this.requestOnScroll$
        .startWith([DEFAULT_SCROLL_POSITION, DEFAULT_SCROLL_POSITION]);
    }

    this.requestOnScroll$
      .exhaustMap(() => this.scrollCallback())
      .subscribe(() => { }, err => {
        console.log(err);
      });

  }

  private isUserScrollingDown = (positions) => {
    return positions[0].sT < positions[1].sT;
  }

  private isScrollExpectedPercent = (position) => {
    return ((position.sT + position.cH) / position.sH) > (this.scrollPercent / 100);
  }

  ngOnDestroy() {
    this.userScrolledDown$.unsubscribe();
    console.log('Destroyed scroll subscription...');
  }

}
