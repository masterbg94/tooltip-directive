import {Directive, ElementRef, HostListener, Input, Renderer2} from '@angular/core';

@Directive({
  selector: '[appTaTooltip]'
})
export class TooltipDirective {
  @Input('appTaTooltip') tooltipTitle: string;
  @Input() placement: string;
  @Input() delay: number = 500;
  @Input() duration: number = 300;
  tooltip: HTMLElement;
  offset = 10;
  @Input() tooltipBackground = '#28529f';


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

  public suma(): number {
    return (Number(this.delay) + Number(this.duration));
  }

  public show() {
    this.create();
    this.setPosition();
    this.renderer.addClass(this.tooltip, 'ng-tooltip-show');
    console.log('this.delay', this.delay);
    console.log('this.duration', this.duration);
    console.log('this.suma', this.suma());
  }

  public hide() {
    this.renderer.removeClass(this.tooltip, 'ng-tooltip-show');
    window.setTimeout(() => {
      this.renderer.removeChild(document.body, this.tooltip);
      // this.renderer.removeChild(this.el.nativeElement, this.tooltip);
      this.tooltip = null;
    }, this.suma());
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
    this.renderer.addClass(this.tooltip, `ng-tooltip-${this.placement}`);

    this.renderer.setStyle(this.tooltip, 'transition', `${this.duration}ms`);
    this.renderer.setStyle(this.tooltip, 'transition-delay', `${this.delay}ms`);
  }

  public setPosition() {

    const hostPos = this.el.nativeElement.getBoundingClientRect();
    console.log('hostPos', hostPos);

    const tooltipPos = this.tooltip.getBoundingClientRect();
    console.log('tooltipPos', tooltipPos);

    const scrollPos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    console.log('scrollPos', scrollPos);

    console.log('innerWidth', window.innerWidth);

    let top;
    let left;
    let right;

    if (this.placement === 'top') {
      top = hostPos.top - tooltipPos.height - this.offset;
      left = hostPos.left + (hostPos.width - tooltipPos.width) / 2;
    }

    if (this.placement === 'bottom-right') {
      top = hostPos.bottom + this.offset;
      // left = hostPos.left + (hostPos.width - tooltipPos.width) / 2;
      left = hostPos.left + hostPos.width / 2;
    }

    if (this.placement === 'bottom-left') {
      top = hostPos.bottom + this.offset;
      // 24 => padding ;  /7*10 => scale transform
      // left = hostPos.left + (hostPos.width / 2) - (tooltipPos.width / 7 * 10) - 24;
      // right = window.innerWidth - hostPos.left - (hostPos.width / 2);
      right = document.body.offsetWidth - hostPos.left - (hostPos.width / 2);
    }

    if (this.placement === 'left') {
      top = hostPos.top + (hostPos.height - tooltipPos.height) / 2;
      left = hostPos.left - tooltipPos.width - this.offset;
    }

    if (this.placement === 'right') {
      top = hostPos.top + (hostPos.height - tooltipPos.height) / 2;
      left = hostPos.right + this.offset;
    }

    if (this.placement === 'bottom-left') {
      this.renderer.setStyle(this.tooltip, 'top', `${top + scrollPos}px`);
      this.renderer.setStyle(this.tooltip, 'right', `${right}px`);
    } else {
      this.renderer.setStyle(this.tooltip, 'top', `${top + scrollPos}px`);
      this.renderer.setStyle(this.tooltip, 'left', `${left}px`);
    }

    this.renderer.setStyle(this.tooltip, 'background', `${this.tooltipBackground}`);
  }

}
