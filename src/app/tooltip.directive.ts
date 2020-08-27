import {Directive, ElementRef, HostListener, Input, Renderer2} from '@angular/core';

@Directive({
  selector: '[appTaTooltip]'
})
export class TooltipDirective {
  @Input('appTaTooltip') tooltipTitle: string;
  @Input() placement: string;
  @Input() delay: number;
  tooltip: HTMLElement;
  offset = 10;

  constructor(private el: ElementRef, private renderer: Renderer2) {
  }

  @HostListener('mouseenter') onMouseEnter() {
    if (!this.tooltip) {
      this.show();
    }
  }

  @HostListener('mouseleave') onMouseLeave() {
    if (this.tooltip) {
      this.hide();
    }
  }

  public show() {
    this.create();
    this.setPosition();
    this.renderer.addClass(this.tooltip, 'ng-tooltip-show');
  }

  public hide() {
    this.renderer.removeClass(this.tooltip, 'ng-tooltip-show');
    window.setTimeout(() => {
      this.renderer.removeChild(document.body, this.tooltip);
      // this.renderer.removeChild(this.el.nativeElement, this.tooltip);
      this.tooltip = null;
    }, this.delay);
  }

  public create() {
    this.tooltip = this.renderer.createElement('span');

    this.renderer.appendChild(
      this.tooltip,
      this.renderer.createText(this.tooltipTitle)
    );

    this.renderer.appendChild(document.body, this.tooltip);
    // this.renderer.appendChild(this.el.nativeElement, this.tooltip);

    this.renderer.addClass(this.tooltip, 'ng-tooltip');
    // this.renderer.addClass(this.tooltip, `ng-tooltip-${this.placement}`);

    // delay
    /*this.renderer.setStyle(this.tooltip, '-webkit-transition', `opacity ${this.delay}ms`);
    this.renderer.setStyle(this.tooltip, '-moz-transition', `opacity ${this.delay}ms`);
    this.renderer.setStyle(this.tooltip, '-o-transition', `opacity ${this.delay}ms`);
    this.renderer.setStyle(this.tooltip, 'transition', `opacity ${this.delay}ms`);
    this.renderer.setStyle(this.tooltip, 'transition-delay', '0.5s');
    this.renderer.setStyle(this.tooltip, 'width', 'fit-content');*/
    this.renderer.setStyle(this.tooltip, 'transition', `${this.delay}ms`);
  }

  public setPosition() {

    const hostPos = this.el.nativeElement.getBoundingClientRect();
    console.log('hostPos', hostPos);

    const tooltipPos = this.tooltip.getBoundingClientRect();
    console.log('tooltipPos', tooltipPos);

    const scrollPos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    console.log('scrollPos', scrollPos);

    let top;
    let left;

    if (this.placement === 'top') {
      top = hostPos.top - tooltipPos.height - this.offset;
      left = hostPos.left + (hostPos.width - tooltipPos.width) / 2;
    }

    if (this.placement === 'bottom') {
      top = hostPos.bottom + this.offset;
      // left = hostPos.left + (hostPos.width - tooltipPos.width) / 2;
      left = hostPos.left + hostPos.width / 2;
    }

    if (this.placement === 'left') {
      top = hostPos.top + (hostPos.height - tooltipPos.height) / 2;
      left = hostPos.left - tooltipPos.width - this.offset;
    }

    if (this.placement === 'right') {
      top = hostPos.top + (hostPos.height - tooltipPos.height) / 2;
      left = hostPos.right + this.offset;
    }

    this.renderer.setStyle(this.tooltip, 'top', `${top + scrollPos}px`);
    this.renderer.setStyle(this.tooltip, 'left', `${left}px`);
  }

}
